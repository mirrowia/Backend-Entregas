const sessionService = require("../services/session");
const { createHash, decodedToken, isValidPassword } = require("../utils");
const passport = require("passport");
const logger = require("../config/logger");
const mailer = require("../config/nodemailer");
const { generateToken, validateToken } = require("../utils");
const path = require('path');
const fs = require("fs");

async function renderLogin(req, res) {
  if (req.cookies.userToken === undefined) return res.render("login");
  const { name, lastname, email, age, cart, rol } = decodedToken(
    req.cookies.userToken
  );
  res.redirect("/shop/");
}
async function login(req, res, next) {
  passport.authenticate("login", async (err, token) => {
    if (err) return res.status(500).send(err.message);
    if (!token) return res.status(400).send("Invalid credentials");
    // GET EMAIL
    const user = decodedToken(token);
    const email = user.email;
    if (email != "adminCoder@coder.com") {
      let dbUser = await sessionService.getUser(email);
      dbUser.last_connection = new Date();
      await sessionService.updateUser(dbUser._id, dbUser);
    }
    logger.info(`El usuario ${email} acaba de iniciar sesion`);

    // USER IS AUTHENTICATED, SAVE TOKEN ON A COOKIE
    res.cookie("userToken", token, { maxAge: 86400000, httpOnly: true });
    if (user.rol === "admin") return res.redirect("/shop/manager");
    return res.redirect("/shop/");
  })(req, res, next);
}

async function renderRegister(req, res) {
  const userToken = req.cookies.userToken;
  if (userToken) {
    logger.info(`El usuario ${name} acaba de iniciar sesion`);
    const { name, lastname, email, age, cart, rol } = JSON.parse(userToken);
    res.render("profile", { name, lastname, email, age, cart, rol });
  } else {
    res.render("register");
  }
}
async function register(req, res) {
  const { name, lastname, email, age, password } = req.body;
  try {
    const user = await sessionService.getUser(email);
    if (user) return res.status(409).send({ error: "User already exist" });
    const newUser = {
      name,
      lastname,
      age,
      email,
      password: createHash(password),
    };
    const result = await sessionService.createUser(newUser);

    logger.debug(`Se acaba de registrar el usuario ${email}`);
    //result.save()
    return res.redirect("/shop/sessions/login");
  } catch (error) {
    return res.status(500).send({ error: "Error while creating a new user" });
  }
}

async function logout(req, res) {
  const token = req.cookies.userToken;
  // GET EMAIL
  const email = decodedToken(token).email;
  logger.info(`El usuario ${email} acaba de cerrar sesion`);
  if (email != "adminCoder@coder.com") {
    let dbUser = await sessionService.getUser(email);
    dbUser.last_connection = new Date();
    await sessionService.updateUser(dbUser._id, dbUser);
  }
  res.clearCookie("userToken");
  return res.redirect("/shop/sessions/login");
}

async function renderPasswordRecover(req, res) {
  const token = req.cookies.userToken;
  if (token) {
    const { name, lastname, email, age, cart, rol } = decodedToken(token);
    res.render("passwordChange", {
      user: { name, lastname, email, age, cart, rol },
    });
  } else {
    res.render("password-recover");
  }
}

async function renderPasswordChange(req, res) {
  const token = req.cookies.userToken;
  const userId = req.params.uid;

  if (token) {
    const { name, lastname, email, age, cart, rol } = decodedToken(token);
    res.render("passwordChange", {
      user: { name, lastname, email, age, cart, rol },
    });
  } else if (userId) {
    const user = await sessionService.getUserById(userId);

    if (!user) return res.status(400).send({ error: "Error" });
    if (user.misc.password_token === undefined)
      return res
        .status(500)
        .send({ error: "No tienes permiso para acceder a esta página" });
    if (!validateToken(user.misc.password_token))
      res.render("password-recover");

    const { name, lastname, email, age, cart, rol } = user;
    res.render("passwordChange", {
      user: { name, lastname, email, age, cart, rol },
    });
  }
}

async function passwordChange(req, res) {
  const { email, password } = req.body;
  try {
    const user = await sessionService.getUser(email);
    //VERIFY IF THE USER EXIST IN THE DB
    if (!user)
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales incorrectas." });
    //VERIFY PREVIOUS PASSWORD
    if (isValidPassword(password, user))
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales incorrectas." });

    const hashedPassword = createHash(password);
    user.password = hashedPassword;
    sessionService.updateUser(user);
    res.clearCookie("userToken");
    return res
      .status(200)
      .send({ status: "ok", message: "Clave cambiada correctamente." });
  } catch (error) {
    logger.error(error);
  }
}

async function sendEmail(req, res) {
  const user = await sessionService.getUser(req.body.email);

  // ESTO ESTÁ HECHO DE MANERA INTENCIONAL PARA EVITAR QUE ALGUIEN LE PEGUE A LA APP Y VEA SI EL CORREO EXISTE O NO
  if (user === null)
    return res.status(200).send({ status: "ok", message: "Correo enviado" });

  const token = generateToken(user.email, "1h");

  user.misc.password_token = token;

  sessionService.updateUser(user._id, user);

  const email = {
    from: "andresisella@gmail.com",
    to: user.email,
    subject: "Security Update - E-Commerce password change",
    html: `
    <p>Hola <b>${user.email}</b>,</p>
    <p>Este es un ejemplo de correo con formato HTML enviado desde Node.js.</p>
    <p>Por favor, haz clic en el siguiente enlace para confirmar: <a href="http://localhost:8080/api/sessions/password-recover/${user._id}"><b>Click Aquí</b></a></p>
  `,
  };

  mailer.sendMail(email, (error, info) => {
    if (error) return console.error(error);

    logger.info("Correo enviado: " + info.response);
  });

  return res.status(200).send({ status: "ok", message: "Correo enviado" });
}

async function githubLogin(req, res, next) {
  passport.authenticate("github")(req, res, next);
}

async function githubCallback(req, res, next) {
  passport.authenticate("github", async (err, token) => {
    if (err)
      return res.status(500).send("Error durante la autenticación con GitHub");
    if (!token)
      return res.status(401).send("Error durante la autenticación con GitHub");

    // GET EMAIL
    const email = decodedToken(token).email;
    logger.info(`El usuario ${email} acaba de iniciar sesion`);

    // Almacena la información del usuario en la cookie
    res.cookie("userToken", token, { maxAge: 86400000, httpOnly: true });

    let dbUser = await sessionService.getUser(email);
    dbUser.last_connection = new Date();
    await sessionService.updateUser(dbUser._id, dbUser);
    return res.redirect("/shop/");
  })(req, res, next);
}

async function renderProfile(req, res) {
  const token = req.cookies.userToken;

  if (!token) res.redirect("/shop/sessions/login");
  const { name, lastname, email, age, cart, rol } = decodedToken(token);

  let user;
  let profile_img;
  let identificacion = false;
  let domicilio = false;
  let cuenta = false;
  let id;

  if (rol != "admin") {
    try {
      user = await sessionService.getUser(email);
    } catch (error) {
      logger.error(error);
    }
    _id = user._id;
    const projectRoot = process.cwd();
    const documentsPath = path.join(projectRoot, 'src', 'uploads', 'documents');

    if (fs.existsSync(`${documentsPath}/${_id}/Identificacion.pdf`))
      identificacion = true;
    if (fs.existsSync(`${documentsPath}/${_id}/Comprobante_de_domicilio.pdf`))
      domicilio = true;
    if (fs.existsSync(`${documentsPath}/${_id}/Comprobante_de_estado_de_cuenta.pdf`))
      cuenta = true;

    profile_img = user.picture;
  } else {
    profile_img = `/profiles/admin/profile.jpeg`;
  }

  res.render("profile", {
    _id,
    name,
    lastname,
    email,
    age,
    cart,
    rol,
    identificacion,
    domicilio,
    cuenta,
    profile_img,
  });
}

async function current(req, res) {
  const token = req.cookies.userToken;
  if (token) {
    const user = decodedToken(token);
    res.status(200).send({
      name: user.name,
      age: user.age,
      email: user.email,
      role: user.rol,
    });
  } else {
    res.status(401).send({ error: "Not Authenticated" });
  }
}

async function renderDocumentation(req, res) {
  const token = req.cookies.userToken;
  if (token) {
    const { _id, name, lastname, email, age, cart, rol } = decodedToken(token);
    res.render("documentation", { _id, name, lastname, email, age, cart, rol });
  } else {
    res.redirect("./login");
  }
}

async function renderUserManagementList(req, res) {
  let { page } = req.query;
  let userList = [];
  const options = {};

  try {
    options.limit = 10;
    if (page) options.page = page;
    const users = await sessionService.getUsersPaginate({}, options);
    users.docs.map((user) => {
      const last_connection = getLastConnectiom(user.last_connection);
      userList.push({
        id: user._id,
        name: user.name,
        last_connection,
        email: user.email,
        rol: user.rol,
      });
    });

    const pageNumbers = [];
    for (let i = 1; i <= users.totalPages; i++) {
      pageNumbers.push({ number: i, current: i === users.page });
    }

    res.render("users-management", {
      status: "success",
      payload: userList,
      totalPages: users.totalPages,
      prevPage: users.prevPage,
      nextPage: users.nextPage,
      page: users.page,
      hasPrevPage: users.hasPrevPage,
      hasNextPage: users.hasNextPage,
      pageNumbers,
    });
  } catch (error) {}
}

async function renderUserManagement(req, res) {
  let { uid } = req.params;

  try {
    const user = await sessionService.getUserById(uid);

    const rol = user.rol === "premium";

    const userFront = {
      apellido: user.lastname,
      edad: user.age,
      email: user.email,
      id: user._id,
      nombre: user.name,
      clave: user.password,
      rol,
    };
    res.render("user-management", {
      status: "success",
      payload: userFront,
    });
  } catch (error) {}
}

function getLastConnectiom(lc) {
  if (lc === null) return "Never";

  const today = new Date();
  const days = Math.floor((today - lc) / (1000 * 60 * 60 * 24));

  if (days == 0) {
    return "Today";
  } else if (days < 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (days < 31) {
    return `${days} month ago`;
  } else if (days < 41) {
    return `${days} months ago`;
  } else if (days < 365) {
    return `${days} year ago`;
  } else if (days < 730) {
    return `${days} years ago`;
  } else {
    return "Desconocido";
  }
}

module.exports = {
  renderLogin,
  login,
  renderRegister,
  register,
  logout,
  renderPasswordRecover,
  renderPasswordChange,
  passwordChange,
  sendEmail,
  githubLogin,
  githubCallback,
  renderProfile,
  current,
  renderDocumentation,
  renderUserManagement,
  renderUserManagementList,
};

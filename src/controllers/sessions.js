const sessionService = require("../services/session");
const { createHash, decodedToken, isValidPassword } = require("../utils");
const passport = require("passport");
const logger = require("../config/logger");
const mailer = require("../config/nodemailer");
const { generateToken, validateToken } = require("../utils");

async function renderLogin(req, res) {
  if (req.cookies.userToken === undefined) return res.render("login");
  const { name, lastname, email, age, cart, rol } = decodedToken(
    req.cookies.userToken
  );
  res.redirect("./");
}
async function login(req, res, next) {
  passport.authenticate("login", (err, token) => {
    if (err) return res.status(500).send(err.message);
    if (!token) return res.status(400).send("Invalid credentials");
    // GET EMAIL
    const user = decodedToken(token);
    const email = user.email;
    logger.info(`El usuario ${email} acaba de iniciar sesion`);

    // USER IS AUTHENTICATED, SAVE TOKEN ON A COOKIE
    res.cookie("userToken", token, { maxAge: 86400000, httpOnly: true });
    if(user.rol === "admin") return res.redirect("/shop/manager");
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
    return res.redirect("/api/sessions/login");
  } catch (error) {
    return res.status(500).send({ error: "Error while creating a new user" });
  }
}

async function logout(req, res) {
  const token = req.cookies.userToken;
  // GET EMAIL
  const email = decodedToken(token).email;
  logger.info(`El usuario ${email} acaba de cerrar sesion`);
  res.clearCookie("userToken");
  res.redirect("./login");
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
  const userId = req.params.uid

  if (token) {
    const { name, lastname, email, age, cart, rol } = decodedToken(token);
    res.render("passwordChange", {
      user: { name, lastname, email, age, cart, rol },
    });
  } else if(userId){
    const user =  await sessionService.getUserById(userId)

    if(!user) return res.status(400).send({ error: "Error" });
    if(user.misc.password_token === undefined) return res.status(500).send({ error: "No tienes permiso para acceder a esta página" });
    if(!validateToken(user.misc.password_token)) res.render("password-recover");

    const { name, lastname, email, age, cart, rol } = user
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
    if (!user) return res.status(400).send({ status: "error", error: "Credenciales incorrectas." });
    //VERIFY PREVIOUS PASSWORD
    if (isValidPassword(password, user)) return res.status(400).send({ status: "error", error: "Credenciales incorrectas." });

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
  if (user === null) return res.status(200).send({ status: "ok", message: "Correo enviado" });

  const token = generateToken(user.email, "1h")

  user.misc.password_token = token

  sessionService.updateUser(user._id, user);

  const email = {
    from: "andresisella@gmail.com",
    to: user.email,
    subject: "Security Update - E-Commerce password change",
    html: `
    <p>Hola <b>${user.email}</b>,</p>
    <p>Este es un ejemplo de correo con formato HTML enviado desde Node.js.</p>
    <p>Por favor, haz clic en el siguiente enlace para confirmar: <a href="http://localhost:8080/api/sessions/password-recover/${user._id}"><b>Click Aquí</b></a></p>
  `
  };

  mailer.sendMail(email, (error, info) => {
    if (error) return console.error(error);

    logger.info("Correo enviado: " + info.response)
  });

  return res
    .status(200)
    .send({ status: "ok", message: "Correo enviado" });
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

    return res.redirect("/shop/");
  })(req, res, next);
}

async function renderProfile(req, res) {
  const token = req.cookies.userToken;
  if (token) {
    const { name, lastname, email, age, cart, rol } = decodedToken(token);
    res.render("profile", { name, lastname, email, age, cart, rol });
  } else {
    res.redirect("./login");
  }
}

async function current(req, res) {
  const token = req.cookies.userToken;
  if (token) {
    const user = decodedToken(token);
    res
      .status(200)
      .send({
        name: user.name,
        age: user.age,
        email: user.email,
        role: user.rol,
      });
  } else {
    res.status(401).send({ error: "Not Authenticated" });
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
};

const { userModel } = require("../models/user");
const { createHash, decodedToken } = require("../../utils");
const passport = require("passport");

async function renderLogin(req, res) {
  return res.render('login');
}
async function login(req, res, next) {
    passport.authenticate("login", (err, user) => {
        if (err) return res.status(500).send(err.message);
        if (!user)return res.status(400).send("Usuario no encontrado");
        // Usuario autenticado, guardar en la sesión y redirigir
        res.cookie('user', JSON.stringify({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          age: user.age,
          rol: user.rol,
          cart: user.cart
      }), { maxAge: 86400000, httpOnly: true });
        return res.redirect("/api/sessions/");
      })(req, res, next);
}

async function renderRegister(req, res) {
  const userCookie = req.cookies.user;
  if (userCookie) {
      const { name, lastname, email, age, cart, rol } = JSON.parse(userCookie);
      res.render("profile", { name, lastname, email, age, cart, rol });
  } else {
      res.render("register");
  }
}
async function register(req, res, next) {
    passport.authenticate("register", (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send("Error al registrar el usuario");
        return res.redirect("./login");
    })(req, res, next);
}

async function logout(req, res) {
  res.clearCookie('token');
  res.redirect("./login");
}

async function renderPasswordChange(req, res) {
  const token = req.cookies.token;
  if (token) {
      const { name, lastname, email, age, cart, rol } = decodedToken(token);
      res.render("passwordChange", { user: { name, lastname, email, age, cart, rol } });
  } else {
      res.render("passwordChange");
  }
}

async function passwordChange(req, res) {
    const { email, password } = req.body;
    console.log(req.body)
  try {
    const user = await userModel.findOne({ email });
    //VERIFY IF THE USER EXIST IN THE DB
    if (!user)
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales incorrectas." });

    const hashedPassword = createHash(password);
    user.password = hashedPassword;
    user.save();
    return res
    .status(200)
    .send({ status: "ok", message: "Clave cambiada correctamente." });

  } catch (error) {
    console.log(error);
  }
}

async function githubLogin(req, res, next) {
    passport.authenticate("github")(req, res, next);
}

async function githubCallback(req, res, next) {
  passport.authenticate('github', async (err, token) => {
      if (err) return res.status(500).send('Error durante la autenticación con GitHub');
      if (!token) return res.status(401).send('Error durante la autenticación con GitHub');

      // Almacena la información del usuario en la cookie
      res.cookie("token", token,  { maxAge: 86400000, httpOnly: true });

      return res.redirect('./');
  })(req, res, next);
}

async function renderProfile(req, res) {
  const token = req.cookies.token;
  if (token) {
      const { name, lastname, email, age, cart, rol } = decodedToken(token);
      res.render("profile", { name, lastname, email, age, cart, rol });
  } else {
      res.redirect("./login");
  }
}

async function current(req, res){
  const token = req.cookies.token;
  if (token) {
      res.status(200).send({user: decodedToken(token)});
  } else {
      res.status(401).send({error: "Not Authenticated"});
  }
}

module.exports = {
  renderLogin  ,
  login,
  renderRegister,
  register,
  logout,
  renderPasswordChange,
  passwordChange,
  githubLogin,
  githubCallback,
  renderProfile,
  current
};
const { userModel } = require("../models/user");
const { createHash } = require("../../utils");
const passport = require("passport");

async function renderLogin(req, res) {
    if (req.session.user) return res.redirect("./");
      return res.render("login");
  }

async function login(req, res, next) {
    passport.authenticate("login", (err, user) => {
        if (err) return res.status(500).send(err.message);
        if (!user)return res.status(400).send("Usuario no encontrado");
        // Usuario autenticado, guardar en la sesión y redirigir
        req.session.user = {
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          age: user.age,
          rol: user.rol,
          cart: user.cart
        };
        return res.redirect("/api/sessions/");
      })(req, res, next);
}

async function renderRegister(req, res) {
    if (req.session.user) {
      const { name, lastname, email, age, cart, rol } = req.session.user;
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
    req.session.destroy((err) => {
        if (err) {
          console.error("Error al cerrar la sesión:", err);
          return res.status(500).json({ message: "Error al cerrar la sesión" });
        }
        return res.status(200).json({ message: "Bye" });
      });
}

async function renderPasswordChange(req, res) {
    const user = req.session.user
    if(user){
      res.render("passwordChange", {user})
    }else{
      res.render("passwordChange");
    }
}

async function passwordChange(req, res) {
    const { email, password } = req.body;
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
    passport.authenticate("github", async (err, user)=>{
        if (err) return res.status(500).send("Error durante la autenticación con GitHub");
        if (!user) return res.status(401).send("Error durante la autenticación con GitHub");

        req.session.user = user; 
        return res.redirect("./");
    })(req, res, next);
}

async function renderProfile(req, res) {
    const { name, lastname, email, age, cart, rol } = req.session.user;
    res.render("profile", { name, lastname, email, age, cart, rol });
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
  renderProfile
};
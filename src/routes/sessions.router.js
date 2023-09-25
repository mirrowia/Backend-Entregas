const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user");
const { cartModel } = require("../models/cart");
const { createHash, isValidPassword } = require("../../utils");
const passport = require("passport");
const initializePassport = require("../config/passport.config");

//LOGIN'S VIEW AND LOGIC
router.get("/login", (req, res) => {
  if(req.session.user) {
    const {username, name, lastname, email, age, cart, rol} = req.session.user
    
    res.render("profile",{ username, name, lastname, email, age, cart, rol })
  }else{
    res.render("login")
  }
});

router.post("/login", passport.authenticate("login", { failureRedirect: "/failurelogin" }), async (req, res) => {
  const { username, password } = req.body;
  console.log(req.user)

  if (!req.user) {
    if (username == "adminCoder@coder.com" && password == "adminCod3r123") {
      req.session.user = {
        username,
        name: "Admin",
        lastname: "Coder",
        email: username,
        age: 25,
        rol: "Admin",
      };
      res.redirect("/api/sessions/");
    } else {
      return res.status(400).send("Usuario no encontrado");
    }
  } else {
    res.send({ status: "success", payload: req.user });
  }
}
);

//REGISTER'S VIEW AND LOGIC
router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failureregister" }),
  async (req, res) => {
    if (!req.body) res.status(500).send("Error al registrar el usuario");
    res.redirect("./login");
  }
);

//FAILURE PAGES
router.get("/failureregister", async (req, res) => {
  console.log("Fail while Authenticating");
  res.send({ error: "Fail" });
});
router.get("/failurelogin", async (req, res) => {
  console.log("Fail while Authenticating");
  res.send({ error: "Fail" });
});

//LOGOUT'S LOGIC
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar la sesión:", err);
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    return res.status(200).json({ message: "Bye" });
  });
});

//PASSWORD'S VIEW AND LOGIC
router.get("/passwordChange", (req, res) => {
  const user = req.session.user
  if(user){
    res.render("passwordChange", {user})
  }else{
    res.render("passwordChange");
  }
});
router.put("/passwordChange", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
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
});

//PROFILE'S VIEW AND LOGIC
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("./login");

  const { username, name, lastname, email, age, cart, rol } = req.session.user;
  res.render("profile", { username, name, lastname, email, age, cart, rol });
});

//GIT LOGIN
router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) =>{
})
router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"./login"}), async (req, res)=>{
  req.session.user = req.user
  res.redirect("/api/sessions/")
})

module.exports = router;

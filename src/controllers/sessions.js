const sessionService = require("../services/session")
const { createHash, decodedToken } = require("../utils");
const passport = require("passport");

async function renderLogin(req, res) {
  return res.render('login');
}
async function login(req, res, next) {
    passport.authenticate("login", (err, token) => {
        if (err) return res.status(500).send(err.message);
        if (!token)return res.status(400).send("Invalid credentials");
        // USER IS AUTHENTICATED, SAVE TOKEN ON A COOKIE
        res.cookie('userToken', token , { maxAge: 86400000, httpOnly: true });
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
async function register(req, res) {
  const { name, lastname, email, age, password} = req.body
    try {
        const user = await sessionService.getUser(email)
        if(user) return res.status(409).send({error: "User already exist"})
        const newUser = {name, lastname, age, email, password: createHash(password)}
        const result = await sessionService.createUser(newUser)
        //result.save()
        return res.redirect("/api/sessions/login")
    } catch (error) {
      return res.status(500).send({error: "Error while creating a new user"})
    }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.redirect("./login");
}

async function renderPasswordChange(req, res) {
  const token = req.cookies.userToken;
  if (token) {
      const { name, lastname, email, age, cart, rol } = decodedToken(token);
      res.render("passwordChange", { user: { name, lastname, email, age, cart, rol } });
  } else {
      res.render("passwordChange");
  }
}

async function passwordChangeEmail(req, res) {
    const { email, password } = req.body;
  try {
    const user = await sessionService.getUser(email)
    //VERIFY IF THE USER EXIST IN THE DB
    if (!user)
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales incorrectas." });

    const hashedPassword = createHash(password);
    user.password = hashedPassword;
    sessionService.updateUser(user)
    return res
    .status(200)
    .send({ status: "ok", message: "Clave cambiada correctamente." });

  } catch (error) {
    console.log(error);
  }
}

async function passwordChange(req, res) {
  const { email, password } = req.body;
try {
  const user = await sessionService.getUser(email)
  //VERIFY IF THE USER EXIST IN THE DB
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales incorrectas." });

  const hashedPassword = createHash(password);
  user.password = hashedPassword;
  sessionService.updateUser(user)
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
      res.cookie("userToken", token,  { maxAge: 86400000, httpOnly: true });

      return res.redirect('./');
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

async function current(req, res){
  const token = req.cookies.userToken;
  if (token) {
    const user = decodedToken(token)
      res.status(200).send({name: user.name, age: user.age, email:user.email, role: user.rol});
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
  passwordChangeEmail,
  githubLogin,
  githubCallback,
  renderProfile,
  current
};
const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessions"); 

router.get("/login", controller.renderLogin);
router.post("/login", controller.login);

router.get("/register", controller.renderRegister);
router.post("/register", controller.register);

router.post("/logout", controller.logout);

router.get("/passwordChange", controller.renderPasswordChange);
router.put("/passwordChange", controller.passwordChange);

router.get("/github", controller.githubLogin);
router.get("/githubcallback", controller.githubCallback);

router.get("/", controller.renderProfile);

module.exports = router;
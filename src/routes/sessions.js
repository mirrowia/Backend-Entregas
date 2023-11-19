const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessions"); 
const { authToken } = require("../utils");

router.get("/login", controller.renderLogin);
router.post("/login", controller.login);

router.get("/register", controller.renderRegister);
router.post("/register", controller.register);

router.post("/logout", authToken, controller.logout);

router.get("/password-change", controller.renderPasswordChange);
router.post("/password-change", controller.passwordChangeEmail);
router.put("/password-change", controller.passwordChange);

router.get("/password-change/:token", controller.sendEmail)

router.get("/github", controller.githubLogin);
router.get("/githubcallback", controller.githubCallback);

router.get("/current", authToken, controller.current )

router.get("/", authToken, controller.renderProfile);


module.exports = router;
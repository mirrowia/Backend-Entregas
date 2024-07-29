const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sessions"); 
const { authToken } = require("../../utils");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/logout", authToken, controller.logout);
router.post("/password-recover", controller.sendEmail)
router.put("/password-change", controller.passwordChange);
router.get("/github", controller.githubLogin);
router.get("/githubcallback", controller.githubCallback);
router.get("/current", authToken, controller.current )

module.exports = router;
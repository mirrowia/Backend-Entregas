const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessions"); 
const { authToken } = require("../../utils");

router.get("/login", controller.renderLogin);
router.post("/login", controller.login);

router.get("/register", controller.renderRegister);
router.post("/register", controller.register);

router.post("/logout", authToken, controller.logout);

router.get("/passwordChange", controller.renderPasswordChange);
router.post("/passwordChange", controller.passwordChangeEmail);
router.put("/passwordChange", controller.passwordChange);

router.get("/github", controller.githubLogin);
router.get("/githubcallback", controller.githubCallback);

router.get("/current", authToken, controller.current )

router.get("/", authToken, controller.renderProfile);


module.exports = router;
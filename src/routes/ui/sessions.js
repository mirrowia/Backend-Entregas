const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sessions"); 
const {isAdmin} = require("../../middlewares/roles")
const { authToken } = require("../../utils");


router.get("/login", controller.renderLogin);
router.get("/register", controller.renderRegister);
router.get("/password-recover", controller.renderPasswordRecover);
router.get("/password-recover/:uid", controller.renderPasswordChange)
router.get("/password-change", controller.renderPasswordChange);
router.get("/profile", authToken, controller.renderProfile);
router.get("/documentation", authToken, controller.renderDocumentation)
router.get("/users-management", authToken, isAdmin, controller.renderUserManagementList)
router.get("/users-management/:uid", authToken, isAdmin, controller.renderUserManagement)
router.get("/", controller.renderLogin);


module.exports = router;
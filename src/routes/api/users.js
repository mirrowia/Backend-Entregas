const express = require("express");
const router = express.Router();
const {isAdmin} = require("../../middlewares/roles")
const { authToken } = require("../../utils");
const controller = require("../../controllers/users"); 

router.get("/premium/:id", authToken, isAdmin, controller.premiumRole);

module.exports = router;
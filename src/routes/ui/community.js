const express = require("express");
const router = express.Router();
const communityRouter = require("../../controllers/community");
const { authToken } = require("../../utils");
const { denyAdmin } = require("../../middlewares/roles")

router.get("/chat", authToken, denyAdmin, communityRouter.getCommunity);

module.exports = router;
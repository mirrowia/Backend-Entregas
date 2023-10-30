const express = require("express");
const router = express.Router();
const communityRouter = require("../controllers/community");
const { authToken } = require("../../utils");

router.get("/", authToken, communityRouter.getCommunity);

module.exports = router;
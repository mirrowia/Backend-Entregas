const express = require("express");
const router = express.Router();
const mocksRouter = require("../../mocks/template.js");
const loggerTest = require("../../mocks/logger.js")

router.get("/", mocksRouter.getMockProducts);
router.get("/logger-test", loggerTest.getLogger)

module.exports = router;
const express = require("express");
const router = express.Router();
const mocksRouter = require("../mocks/template.js");

router.get("/", mocksRouter.getMockProducts);

module.exports = router;
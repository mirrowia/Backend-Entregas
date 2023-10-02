const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const { authToken } = require("../../utils");

router.get("/", authToken, productsController.getProducts);
router.get("/list", authToken, productsController.getProductsList);
router.get("/:id", authToken, productsController.getProductById);
router.get("/categories", authToken, productsController.getProductCategories);

module.exports = router;
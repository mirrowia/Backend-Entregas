const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);
router.get("/list", productsController.getProductsList);
router.get("/:id", productsController.getProductById);
router.get("/categories", productsController.getProductCategories);

module.exports = router;
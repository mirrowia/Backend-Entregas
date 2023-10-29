const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const {isAdmin} = require("../middlewares/roles")
const { authToken } = require("../../utils");

router.get("/", authToken, productsController.getProducts);
router.get("/list", authToken, productsController.getProductsList);
router.get("/manager", authToken, isAdmin, productsController.getProductsManager);
router.get("/manager/:id", authToken, isAdmin, productsController.getProductManager);
router.get("/categories", authToken, productsController.getProductCategories);
router.get("/:id", authToken, productsController.getProductById);
router.put("/:id", authToken, isAdmin, productsController.updateProduct);

module.exports = router;
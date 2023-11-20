const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const {isAdmin, isPremium, denyAdmin} = require("../middlewares/roles")
const {checkProductValues} = require("../middlewares/errorHandler")
const { authToken } = require("../utils");

router.get("/", authToken, productsController.getProducts);
router.get("/list", authToken, denyAdmin, productsController.getProductsList);
router.get("/manager", authToken, isAdmin, productsController.getProductsManager);

router.get("/manager/new-product", authToken, isPremium, productsController.getCreateProduct);
router.post("/manager/new-product", authToken, isPremium, checkProductValues, productsController.postCreateProduct);

router.get("/manager/:id", authToken, isPremium, productsController.getProductManager);
router.delete("/manager/:id", authToken, isPremium, productsController.deleteProduct);
router.get("/categories", authToken, productsController.getProductCategories);
router.get("/:id", authToken, denyAdmin, productsController.getProductById);
router.put("/:id", authToken, isPremium, checkProductValues, productsController.updateProduct);

module.exports = router;
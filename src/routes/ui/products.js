const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/products");
const {isAdmin, isPremium, denyAdmin} = require("../../middlewares/roles")
const {checkProductValues} = require("../../middlewares/errorHandler")
const { authToken } = require("../../utils");

router.get("/", authToken, denyAdmin, productsController.renderProducts);
router.get("/manager", authToken, isAdmin, productsController.renderManager);
router.get("/manager/new-product", authToken, isPremium, productsController.renderProductCreation);
router.get("/manager/:id", authToken, isPremium, productsController.renderProductManagement);
router.get("/:id", authToken, denyAdmin, productsController.renderProduct);

module.exports = router;
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const {isAdmin, denyAdmin} = require("../middlewares/roles")
const { authToken } = require("../../utils");

router.get("/", authToken, productsController.getProducts);
router.get("/list", authToken, denyAdmin, productsController.getProductsList);
router.get("/manager", authToken, isAdmin, productsController.getProductsManager);
router.get("/manager/new-product", authToken, isAdmin, productsController.getCreateProduct);
router.post("/manager/new-product", authToken, isAdmin, productsController.postCreateProduct);
router.get("/manager/:id", authToken, isAdmin, productsController.getProductManager);
router.delete("/manager/:id", authToken, isAdmin, productsController.deleteProduct);
router.get("/categories", authToken, productsController.getProductCategories);
router.get("/:id", authToken, denyAdmin, productsController.getProductById);
router.put("/:id", authToken, isAdmin, productsController.updateProduct);

module.exports = router;
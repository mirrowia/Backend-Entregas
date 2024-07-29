const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/products");
const {isAdmin, isPremium, denyAdmin} = require("../../middlewares/roles")
const {checkProductValues} = require("../../middlewares/errorHandler")
const { authToken } = require("../../utils");
const { products }= require("../../middlewares/multer")

router.get("/", authToken, productsController.getProducts);
router.post("/manager/new-product", authToken, isPremium, checkProductValues, productsController.createProduct);
router.delete("/manager/:id", authToken, isPremium, productsController.deleteProduct);
router.get("/categories", authToken, productsController.getProductCategories);
router.post("/:id/image", authToken, isPremium, products.single('product_image'), productsController.setproductImage);
router.get("/:id", authToken, denyAdmin, productsController.getProductById);
router.put("/:id", authToken, isPremium, checkProductValues, productsController.updateProduct);



module.exports = router;
const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/carts");
const { authToken } = require("../../utils");

router.get("/", authToken, cartsController.getCarts);
router.get("/:cid", authToken, cartsController.getCartById);
router.put("/:cid", authToken, cartsController.addProductToCart);
router.get("/:cid/purchase", authToken, cartsController.getPurchase);
router.put("/:cid/products/:pid", authToken, cartsController.updateProductQuantity);
router.delete("/:cid/products/:pid", authToken, cartsController.removeProductFromCart);
router.delete("/:cid", authToken, cartsController.clearCart);

module.exports = router;
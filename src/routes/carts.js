const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/carts");

router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);
router.put("/:cid", cartsController.addProductToCart);
router.put("/:cid/products/:pid", cartsController.updateProductQuantity);
router.delete("/:cid/products/:pid", cartsController.removeProductFromCart);
router.delete("/:cid", cartsController.clearCart);

module.exports = router;
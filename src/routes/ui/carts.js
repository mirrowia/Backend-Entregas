const express = require("express");
const router = express.Router();
const cartsController = require("../../controllers/carts");
const { authToken } = require("../../utils");

router.get("/:cid", authToken, cartsController.renderCart);
router.get("/:cid/purchase/", authToken, cartsController.generateTicket);
router.get("/:cid/purchase/:tid", authToken, cartsController.renderPurchase);

module.exports = router;
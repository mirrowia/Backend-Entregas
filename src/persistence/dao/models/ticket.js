const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: Number, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true},
  resume: {
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    not_purchased_products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    purchased_products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
  },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = { ticketModel };

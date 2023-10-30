const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: Number, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true}
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = { ticketModel };

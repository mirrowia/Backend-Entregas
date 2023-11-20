const mongoose = require("mongoose");
const { cartModel } = require("./cart")

const userCollection = "users";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  lastname: { type: String, require: true },
  age: { type: Number, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  rol: {
    type: String,
    enum: ["premium", "admin", "user"],
    default: "user"
  },
  misc: {type: Object, default: {} }
});

//CREATE NEW CART IF NOT BEEN SPECIFIED
userSchema.pre('save', async function (next) {
  try {
    if (!this.cart) {
      const newCart = await cartModel.create({ user: this._id, products: [] });
      this.cart = newCart._id;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = { userModel };

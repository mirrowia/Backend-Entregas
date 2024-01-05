const mongoose = require("mongoose");
const { cartModel } = require("./cart")
const mongoosePaginate = require('mongoose-paginate-v2');

const userCollection = "users";

const userSchema = new mongoose.Schema({
  age: { type: Number, require: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  documents:{
    type: [
      {
        name: { type: String, require: true},
        reference: { type: String, require: true },
      },
    ],
    default: [],
  },
  email: { type: String, require: true },
  lastname: { type: String, require: true },
  last_connection: { type: Date, default: "" },
  misc: {type: Object, default: {} },
  name: { type: String, require: true },
  password: { type: String, require: true },
  picture:{type: String, default:"https://files.cults3d.com/uploaders/13479126/illustration-file/de3adb08-3b60-4738-8b7c-6fe6b88a3f90/Vault_Boy.png"},
  rol: {
    type: String,
    enum: ["premium", "admin", "user"],
    default: "user"
  }
 
});

// PAGINATION
userSchema.plugin(mongoosePaginate);

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

const { cartModel } = require('./models/cart');

const cartDAO = {
  async getCarts(){
    return await cartModel.find();
  },

  async getCart(id){
    return await cartModel.findById(id)
  },

  async updateCart(id, cart) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(id, cart, { new: true });
      return updatedCart;
    } catch (error) {
      throw new Error('Error al actualizar el carrito: ' + error.message);
    }
  },
};

module.exports = cartDAO;

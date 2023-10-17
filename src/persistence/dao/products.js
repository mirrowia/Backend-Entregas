const { productModel } = require('./models/product');

const productDAO = {
  async getProducts() {
    return await productModel.find();
  },

  async getProductsPaginate(object, options){
    if (object) return await productModel.paginate(object, options);
    return await productModel.paginate({}, options); 
  },
  
  async getProduct(id) {
    return await productModel.findById(id);
  },
  
  async createProduct(newProduct) {
    const product = new productModel(newProduct);
    return await product.save();
  },
  
  async updateProduct(id, newProduct) {
    return await productModel.findByIdAndUpdate(id, newProduct, { new: true });
  },
  
  async deleteProduct(id) {
    return await productModel.findByIdAndDelete(id);
  },

  async getCategories(){
    return await productModel.distinct("category");
  }
};

module.exports = productDAO;

const productData = require ("../persistence/dao/products")

function getProducts(){
    return productData.getProducts();
}

function getProductsPaginate(object, options){
    return productData.getPRoductsPaginate(object, options)
}

function getProduct(id){
    return productData.getProduct(id);
}

function updateProduct(id, product){
    return productData.updateProduct(id, product)
}

function getCategories(){
    return productData.getCategories()
}

module.exports = {
    getProducts,
    getProductsPaginate,
    getProduct,
    updateProduct,
    getCategories
}
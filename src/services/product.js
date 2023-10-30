const productData = require ("../persistence/dao/products")

function getProducts(){
    return productData.getProducts();
}

function getProductsPaginate(object, options){
    return productData.getProductsPaginate(object, options)
}

function getProduct(id){
    return productData.getProduct(id);
}

function addProduct(product){
    return productData.createProduct(product)
}

function updateProduct(id, product){
    return productData.updateProduct(id, product)
}

function deleteProduct(id){
    return productData.deleteProduct(id)
}

function getCategories(){
    return productData.getCategories()
}

module.exports = {
    getProducts,
    getProductsPaginate,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories
}
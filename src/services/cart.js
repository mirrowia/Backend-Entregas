const cartData = require ("../persistence/dao/cart")

function getCarts(){
    return cartData.getCarts();
}

function getCart(id){
    return cartData.getCart(id);
}

function createCart(cart){
    return cartData.createCart(cart)
}

function updateCart(id, cart){
    return cartData.updateCart(id, cart)
}

module.exports = {
    getCarts,
    getCart,
    updateCart
}
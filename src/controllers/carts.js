const { decodedToken } = require("../../utils");
const cartService = require("../services/cart")
const productService = require("../services/product")

async function getCarts(req, res) {
  try {
    const carts = cartService.getCarts()
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
}

async function getCartById(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token);
  const id = req.params.cid;
  try {
    const cart = await cartService.getCart(id)
      const promise = cart.products.map(async (product) => {
          const p = {};
          const details = await productService.getProduct(product.product);
          p.details = details;
          p.quantity = product.quantity;
          p.total = details.price * product.quantity;
          return p;
      });
      const products = await Promise.all(promise);
      let total = 0;
      products.map((product) => {
          total += product.total;
      });

      total = total.toFixed(2);

      res.render("cart", {
          status: "success",
          cartId: id,
          username:user.name,
          useremail: user.email,
          products,
          total,
      });
  } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "Error al obtener el carrito." });
  }
}

async function addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.body.productId;
  
    try {
      const product = await productService.getProduct(productId);
      if (!product) res.status(404).json({ error: "No se encontro el producto" });
      if (!product.stock > 0)
        res.status(404).json({ error: "No hay stock disponible del producto" });
  
      const cart = await cartService.getCart(cartId)
      if (!cart) res.status(404).json({ error: "No se encontro el carrito" });
      const cartProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );
  
      if (cartProduct) {
        cartProduct.quantity += 1;
      } else {
        cart.products.push({ product: product._id });
      }
  
      product.stock -= 1;

      await productService.updateProduct(productId , product);
      await cartService.updateCart(cartId, cart);

      res.status(200).json({ ok: "Producto agregado correctamente" });
    } catch (error) {
      console.log(error);
    }
}

async function updateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    let quantity = req.body.quantity;
  
    try {
      //Check if stock was passed as parameter
      if (!quantity) res.status(404).json({ error: "Cantidad no indicado" });
  
      if (quantity < 0)
        res.status(404).json({ error: "Cantidad no puede ser negativo" });
  
      //Search for cart by ID
      const cart = await cartService.getCart(cid);
  
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      //If cart exist search if the product exist in the cart
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid
      );
  
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ error: "Producto no encontrado en el carrito" });
      }
  
      //Update product quantity
      cart.products[productIndex].quantity = quantity;
  
      //Save new cart
      await cartService.updateCart(cid, cart)
  
      res.json({ message: "La cantidad del producto fue actualizada con exito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
}

async function removeProductFromCart(req, res) {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
  
    try {
      //Search for cart by ID
      const cart = await cartService.getCart(cid);
  
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      //If cart exist search if the product exist in the cart
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid
      );
  
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ error: "Producto no encontrado en el carrito" });
      }
      //Delete product
      cart.products.splice(productIndex, 1);
      //Save new cart
      await cartService.updateCart(cid, cart)
  
      const product = await productService.getProduct(pid);
      product.stock += parseInt(quantity);
  
      await productService.updateProduct(pid, product)
  
      res.json({ message: "Producto eliminado del carrito con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
}

async function clearCart(req, res) {
    const { cid } = req.params;
  
    try {
      const cart = await cartService.getCart(cid);
      const products = cart.products;
  
      products.map(async (product) => {
        const p = await productService.getProduct(product.product._id)
        p.stock += product.quantity;
        await productService.updateProduct(product.product._id, p)
      });
  
      cart.products = [];
  
      await cartService.updateCart(cid, cart)
      res.json({ message: "Productos eliminados del carrito con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = {
  getCarts,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
};

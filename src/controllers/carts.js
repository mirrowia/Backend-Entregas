const { decodedToken } = require("../utils");
const cartService = require("../services/cart");
const productService = require("../services/product");
const ticketService = require("../services/ticket");

async function getCarts(req, res) {
  try {
    const carts = await cartService.getCarts();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
}

async function renderCart(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token);
  const id = req.params.cid;
  try {
    const { products, total } = await cartFunction(id);
    res.render("cart", {
      status: "success",
      cartId: id,
      username: user.name,
      useremail: user.email,
      products,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
}

async function getCart(req, res) {
  const id = req.params.cid;
  try {
    const { cart } = await cartFunction(id);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
}

async function cartFunction(cartId) {
  try {
    const cart = await cartService.getCart(cartId);
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

    return { cart, products, total };
  } catch (error) {
    return error;
  }
}

async function generateTicket(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token);
  const email = user.email;
  const cartId = req.params.cid;

  try {
    const ticketDb = await purchaseFunction(cartId, user.name, email);
    res.redirect(`./purchase/${ticketDb._id}`);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al generar la compra" });
  } 
}

async function renderPurchase(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token);
  const email = user.email;
  const cartId = req.params.cid;
  const ticketId = req.params.tid;

  if (!ticketId) res.status(500).json({ status: "error", message: "Error al obtener el ticket" });
  
  const ticket = await ticketService.getTicket(ticketId)

    try {
      res.render("ticket", {
        status: "success",
        ticket
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener los carritos" });
    }
  
}

async function getPurchase(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token);
  const email = user.email;
  const id = req.params.cid;

  try {
    const { ticket, notPurchasedProducts, purchasedProducts, cart } =
      await purchaseFunction(id, user.name, email);

    res.json({
      status: "success",
      payload: { ticket, notPurchasedProducts, purchasedProducts, cart },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
}

async function purchaseFunction(cartId, name, email) {
  try {
    // GET CART
    const cart = await cartService.getCart(cartId);

    // VERIFY IF CART IS EMPTY
    if (cart.products.length === 0) return { cartId, username: name, useremail: email };

    // CHECK STOCK
    const purchasedProducts = [];
    const notPurchasedProducts = [];
    const notPurchasedProductsCart = [];
    let totalQuantity = 0;
    let totalPrice = 0;

    const promises = cart.products.map(async (product) => {
      const productDB = await productService.getProduct(product.product);
      if (product.quantity > productDB.stock) {
        notPurchasedProducts.push({
          productId: product.product,
          productName: productDB.name,
          quantity: product.quantity,
          price: productDB.price,
          totalPrice: product.quantity * productDB.price,
        });
        notPurchasedProductsCart.push(product);
      } else {
        productDB.stock -= product.quantity;
        await productService.updateProduct(product.product, productDB);
        purchasedProducts.push({
          productId: product.product,
          productName: productDB.name,
          quantity: product.quantity,
          unitPrice: productDB.price,
          totalPrice: product.quantity * productDB.price,
        });
        totalPrice += product.quantity * productDB.price;
        totalQuantity += product.quantity;
      }
    });

    // WAIT FOR ALL STOCK VALIDATION TO FINISH
    await Promise.all(promises);

    // GET TICKET LIST
    const ticketList = await ticketService.getTickets();

    // IF LIST IS EMPTY HIGHESTCODE WILL BE 0 , ELSE GET THE MAX ORDER VALUE
    const highestCode =
      ticketList.length === 0
        ? 0
        : Math.max(...ticketList.map((ticket) => ticket.code));

    // TRIM DECIMAL SPACES ON THE TOTAL PRICE
    const totalAmount = parseFloat(totalPrice.toFixed(2));

    const ticket = {
      code: highestCode + 1,
      amount: totalAmount,
      purchaser: email,
      resume:{
        cart: cartId,
        purchased_products: purchasedProducts,
        not_purchased_products: notPurchasedProducts
      }

    };

    let ticketDb = await ticketService.createTicket(ticket);

    ticket.date = ticketDb.purchase_datetime;

    cart.products = notPurchasedProductsCart;

    await cartService.updateCart(cartId, cart);

    return ticketDb;
  } catch (error) {
    console.log(error)
    return error;
  }
}

async function addProductToCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.body.productId;

  try {
    const product = await productService.getProduct(productId);

    const user = decodedToken(req.cookies.userToken);

    if (user.rol != "admin") {
      if (product.owner) {
        if (product.owner == user._id)
          return res
            .status(404)
            .json({
              error:
                "No puedes agregar al carrito los productos que hayas publicado.",
            });
      }
    }

    if (!product)
      return res.status(404).json({ error: "No se encontro el producto" });
    if (!product.stock > 0)
      return res
        .status(404)
        .json({ error: "No hay stock disponible del producto" });

    const cart = await cartService.getCart(cartId);
    if (!cart) res.status(404).json({ error: "No se encontro el carrito" });
    const cartProduct = cart.products.find(
      (product) => product.product.toString() === productId
    );
    if (cartProduct) {
      if (cartProduct.quantity >= product.stock)
        return res
          .status(404)
          .json({
            error: "Ya no se puede agregar mas cantidad de este producto",
          });
      cartProduct.quantity += 1;
    } else {
      cart.products.push({ product: product._id });
    }

    product.stock -= 1;

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

    //Save new cart
    await cartService.updateCart(cid, cart);

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
    await cartService.updateCart(cid, cart);

    const product = await productService.getProduct(pid);
    product.stock += parseInt(quantity);

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
      const p = await productService.getProduct(product.product._id);
      p.stock += product.quantity;
      await productService.updateProduct(product.product._id, p);
    });

    cart.products = [];

    await cartService.updateCart(cid, cart);
    res.json({ message: "Productos eliminados del carrito con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getCarts,
  getCart,
  getPurchase,
  generateTicket,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
  renderCart,
  renderPurchase,
};

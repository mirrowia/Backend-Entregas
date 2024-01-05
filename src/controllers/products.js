const productService = require("../services/product");
const sessionService = require("../services/session");
const { decodedToken } = require("../utils")
const mailer = require("../config/nodemailer");
const { logger } = require("../config/nodemailer");

async function getProducts(req, res) {
  let { limit, page, sort, category, stock } = req.query;
  try {
    const options = {};
    options.limit = limit ? limit : 10;
    if (sort) {
      sort == 1 || sort == -1
        ? (options.sort = { price: sort })
        : res.send({ error: "El valor para ordenar debe ser 1 o -1" });
    }
    if (page) options.page = page;

    let products;
    if (category) {
      products = await productService.getProductsPaginate(
        { category: category },
        options
      );
    } else if (stock != undefined) {
      products = await productService.getProductsPaginate(
        { stock: { $gt: 0 } },
        options
      );
    } else {
      products = await productService.getProductsPaginate({}, options);
    }

    const pageNumbers = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pageNumbers.push({ number: i, current: i === products.page });
    }

    res.send({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}`
        : null,
    });
  } catch (error) {
    res.render("products", {
      status: "error",
    });
  }
}

async function renderProducts(req, res) {
  const token = req.cookies.userToken;
  const { cart, email, _id, rol} = decodedToken(token);

  let { limit, page, sort, query } = req.query;

  try {
    const options = {};
    options.limit = limit ? limit : 10;
    if (sort) {
      sort == 1 || sort == -1
        ? (options.sort = { price: sort })
        : res.send({ error: "El valor para ordenar debe ser 1 o -1" });
    }
    if (page) options.page = page;
    query = query ? { category: query } : {};

    let products = await productService.getProductsPaginate(query, options);

    const pageNumbers = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pageNumbers.push({ number: i, current: i === products.page });
    }
    let categories;
    try {
      const result = await productService.getCategories();
      categories = result;
      categories.push("Todas");
    } catch (error) {
      console.log(error);
    }

    products.docs = products.docs.map(product => {
      if(product._doc.owner == _id){
        product._doc.owner = true;
      }else{
        product._doc.owner = false
      }
      return product
    });

    res.render("products", {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      pageNumbers: pageNumbers,
      categories: categories,
      cart,
      rol,
      username: email,
    });
  } catch (error) {
    res.render("products", {
      status: "error",
    });
  }
}

async function renderProduct(req, res) {
  let id = req.params.id;
  const userToken = req.cookies.userToken
  const cart = decodedToken(userToken).cart
  try {
    const product = await productService.getProduct(id);

    res.render("product", {
      payload: product,
      cart: cart
    });
  } catch (error) {
    res.status({
      status: error,
    });
  }
}

async function getProductById(req, res) {
  let id = req.params.id;
  try {
    const product = await productService.getProduct(id);

    res.render("product", {
      payload: product,
    });
  } catch (error) {
    res.status({
      status: error,
    });
  }
}

async function getProductCategories(req, res) {
  try {
    const categories = await productService.getCategories();
    res.send({
      categories: categories,
    });
  } catch (error) {
    res.render("products", {
      status: error,
    });
  }
}

async function renderManager(req, res) {
  const token = req.cookies.userToken;
  const { cart, email } = decodedToken(token);

  let { limit, page, sort, query } = req.query;

  try {
    const options = {};
    options.limit = limit ? limit : 10;
    if (sort) {
      sort == 1 || sort == -1
        ? (options.sort = { price: sort })
        : res.send({ error: "El valor para ordenar debe ser 1 o -1" });
    }
    if (page) options.page = page;
    query = query ? { category: query } : {};

    let products = await productService.getProductsPaginate(query, options);

    const pageNumbers = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pageNumbers.push({ number: i, current: i === products.page });
    }
    let categories;
    try {
      const result = await productService.getCategories();
      categories = result;
      categories.push("Todas");
    } catch (error) {
      console.log(error);
    }
    res.render("productsManager", {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      pageNumbers: pageNumbers,
      categories: categories,
      cart,
      username: email,
    });
  } catch (error) {
    res.render("products", {
      status: "error",
    });
  }
}

async function renderProductManagement(req, res) {
  let id = req.params.id;
  try {
    const product = await productService.getProduct(id);
    const userId = (decodedToken(req.cookies.userToken))._id
    if(product.owner != userId){
      if(req.user.rol !== 'admin') return res.status(403).json({ error: 'Acceso no autorizado.' });
    } 
    res.render("productManager", {
      payload: product,
    });
  } catch (error) {
    res.status({
      status: error,
    });
  }
}

async function renderProductCreation(req, res) {
  try {
    res.render("create-product");
  } catch (error) {
    res.status({
      status: error,
    });
  }
}

async function createProduct(req, res) {
  const token = req.cookies.userToken;
  const user = decodedToken(token)
  const { name, description, category, stock, price, image_url } = req.body;

  const owner =  user._id;
  
  try {
    const newProduct = {
      name,
      description,
      category,
      stock,
      price,
      image_url,
      owner,
    }
    productService.addProduct(newProduct);

    res.status(200).json({ message: 'Producto creado correctamente', userRole: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateProduct(req, res) {
  let id = req.params.id;
  const userId = (decodedToken(req.cookies.userToken))._id
  const { name, description, category, stock, price, image_url} = req.body;

  try {
    let product = await productService.getProduct(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    if(! product.owner == userId) return res.status(403).json({ error: 'Acceso no autorizado.' });

    product.name = name;
    product.description = description;
    product.category = category;
    product.stock = stock;
    product.price = price;
    product.image_url = image_url;

     productService.updateProduct(id, product);
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteProduct(req, res) {
  let id = req.params.id;
  const token = req.cookies.userToken;
  const { email, rol} = decodedToken(token);

  try {
    let product = await productService.getProduct(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const owner = await sessionService.getUserById(product.owner)
    const user = await sessionService.getUser(email)

    if(rol != "admin"){
      if(owner._id.toString() != user._id.toString())return res.status(403).json({ error: 'Acceso no autorizado.' });
    }

    await productService.deleteProduct(id)

    const emailToUser = {
      from: "andresisella@gmail.com",
      to: owner.email,
      subject: "Product Update - E-Commerce product removed",
      html: `<p>We're sorry to inform you that your product <b>${product.name}</b> has been removed from the store.</p>`,
    };

    mailer.sendMail(emailToUser, (error, info) => {
      if (error) return console.error(error);

      logger.info("Correo enviado: " + info.response);
    });

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function setproductImage(req, res) {
  const productId = req.params.id;
  try {
    //VERIFY IF A FILE WAS UPLOADED
    if (!req.file) {return res.status(400).json({ error: "No se proporcionó ningún archivo." })}

    let product = await productService.getProduct(productId)

    product.image_url = `/products/${productId}/product.jpeg`

    await productService.updateProduct(productId, product)

    return res
      .status(200)
      .json({ message: "Archivo subido con éxito."});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}


module.exports = {
  getProducts,
  getProductById,
  getProductCategories,
  setproductImage,
  createProduct,
  deleteProduct,
  updateProduct,
  renderProducts,
  renderManager,
  renderProductCreation,
  renderProductManagement,
  renderProduct,
};

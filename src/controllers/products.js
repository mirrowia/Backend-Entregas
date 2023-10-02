const { productModel } = require("../models/product");

async function getProducts(req, res) {
    if (!req.cookies.user) return res.redirect("/api/sessions/login");
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
        products = await productModel.paginate({ category: category }, options);
      } else if (stock != undefined) {
        products = await productModel.paginate({ stock: { $gt: 0 } }, options);
      } else {
        products = await productModel.paginate({}, options);
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

async function getProductsList(req, res) {
    if (!req.cookies.user) return res.redirect("/api/sessions/login");

    const userCookie  = req.cookies.user;
    const { cart, email } = JSON.parse(userCookie);
    
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
  
      let products = await productModel.paginate(query, options);
  
      const pageNumbers = [];
      for (let i = 1; i <= products.totalPages; i++) {
        pageNumbers.push({ number: i, current: i === products.page });
      }
      let categories;
      try {
        const result = await productModel.distinct("category");
        categories = result;
        categories.push("Todas");
      } catch (error) {
        console.log(error)
      }
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
        username: email
      });
    } catch (error) {
      res.render("products", {
        status: "error",
      });
    }
}

async function getProductById(req, res) {
    if (!req.cookies.user) return res.redirect("/api/sessions/login");
    let id = req.params.id;
    try {
      const product = await productModel.findById(id);
  
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
    if (!req.cookies.user) return res.redirect("/api/sessions/login");
    try {
      const categories = await productModel.distinct("category");
      res.send({
        categories: categories,
      });
    } catch (error) {
      res.render("products", {
        status: error,
      });
    }
}

module.exports = {
  getProducts,
  getProductsList,
  getProductById,
  getProductCategories,
};
const { decodedToken } = require("../../utils");

async function getCommunity(req, res) {
  try {
    const user = decodedToken(req.cookies.userToken)
    const cart = user.cart;
    const email = user.email
    res.render("community", {
        status: "success",
        cart,
        email
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al mostrar la comunidad" });
  }
}

module.exports = {
  getCommunity,
};

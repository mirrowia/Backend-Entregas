const ErrorType= {
    INVALID_PARAM : "INVALID PARAM",
}

// Middleware that checks products input
function checkProductValues(req, res, next) {
    const { name, description, category, stock, price, image_url } = req.body;
    
    if (name == undefined ) return next(new Error("El nombre no puede estar vacío"));
    if (description == undefined) return next(new Error("La descripción no puede estar vacía"));
    if (stock < 0 || price < 0) return next(new Error("Los valores stock o price no pueden ser negativos"));
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/.test(category)) return next(new Error("El valor de category solo puede contener letras y espacios"));
    if (/\s/.test(image_url)) return next(new Error("El valor de la URL no debe contener espacios"));

    next();
}

module.exports = {
    checkProductValues
  }
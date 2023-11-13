const ErrorType= {
    INVALID_PARAM : "INVALID PARAM",
}

// Middleware that checks products input
function checkProductValues(req, res, next) {
    const {name, description, category, stock, price, image_url} = req.body
    let error = undefined;
    if(stock < 0 || price < 0){
        error = new Error("Los valores stock o price no pueden ser negativos");
    }else if(/^[a-zA-Z\s]+$/.test(category)){
        error = new Error("El valor de category solo puede contener letras y espacios");
    }else if([/^\S*$/].test(image_url)){
        error = new Error("El valor de la url no debe contener espacios");
    }

    if(error != undefined) {
        error.type = ErrorType.INVALID_PARAM
        next(error);
    }
    next();
  }

module.exports = {
    checkProductValues
  }
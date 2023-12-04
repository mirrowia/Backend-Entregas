const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

PRIVATE_KEY= process.env.PRIVATE_KEY

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

const generateToken = (user, time) =>{
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: time });
    return token
}

const validateToken = (req, res) =>{
    const token = req
    try {
        const decodedToken = jwt.verify(token, PRIVATE_KEY);
        return true;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          // El token ha expirado
          console.log('El token ha expirado');
        } else {
          // Otro error de verificación
          console.error('Error al verificar el token:', error.message);
        }
        return null;
      }
}

const authToken = (req, res, next) =>{
    const token = req.cookies.userToken
    if(!token) return res.redirect("/shop/sessions/login")
    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.status(403).send({error: "No Authorized"})
        req.user = credentials.user
        next()
    })
}

const decodedToken= (token) =>{
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    const user = decodedToken.user
    return user
}

module.exports = {
    createHash,
    isValidPassword,
    generateToken,
    authToken,
    decodedToken,
    validateToken
};

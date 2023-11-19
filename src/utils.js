const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

PRIVATE_KEY= process.env.PRIVATE_KEY

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateToken = (user, time) =>{
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: time });
    return token
}

const authToken = (req, res, next) =>{
    const token = req.cookies.userToken
    if(!token) return res.redirect("/api/sessions/login")
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
    decodedToken
};

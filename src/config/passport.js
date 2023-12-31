const passport = require ("passport")
const local = require("passport-local")
const sessionService = require("../services/session")
const cartService = require("../services/cart")
const {createHash, isValidPassword, generateToken, authToken} = require ("../utils")
const GitHubStrategy = require("passport-github2")
const dotenv = require("dotenv")

dotenv.config();

const localStrategy = local.Strategy
const PRIVATE_KEY = process.env.PRIVATE_KEY

const initializePassport = () => {

    passport.use("login", new localStrategy({emailField: "email"}, async (email, password, done)=>{
            try {
                if (email == "adminCoder@coder.com" && password == "adminCod3r123"){
                    const user = {
                        name: "Administrador",
                        lastname: "Administrador",
                        age: 18,
                        email: "adminCoder@coder.com",
                        password: "adminCod3r123",
                        rol: "admin"
                    }
                    const accessToken = generateToken(user, "24h")
                    return done(null, accessToken)
                }
                const user = await sessionService.getUser(email)
                if (!user) return done(null, false)
                if(!isValidPassword(password, user)) return done(null, false)

                const accessToken = generateToken(user, "24h")
                return done(null, accessToken)
            } catch (error) {
                done("Internal server error" + error)
            }
        }
    ))
    
    passport.use("github", new GitHubStrategy({
                clientID : "Iv1.ef444c7acd58feb4",
                clientSecret: "52b928542c561c6cf722e51f536fdebedffb1fbd",
                callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        
            },async (accessToken, refreshToken, profile, done) =>{
                try {
                    const user = await sessionService.getUser(profile._json.email)
                    if(!user){
                        const newuser ={
                            name: profile._json.name,
                            lastname: "",
                            age: 18,
                            email: profile._json.email,
                            password: ""
                        }
                        let result = await sessionService.createUser(newuser)
                        const cart = await cartService.createCart({user: result._id, products: []})
                        result.cart = cart
                        result.save()
                        const accessToken = generateToken(result)
                        done(null, accessToken)
                    }else{
                        const accessToken = generateToken(user, "24h")
                        done(null, accessToken)
                    }
                } catch (error) {
                    return done(error)
                }
            }
            ))

    passport.serializeUser((user, done) =>{
        return done(null, user._id);
    })

    passport.deserializeUser(async (id, done)=>{
        const user = await sessionService.getUserById(id)
        return done(null, user)
    })

}

module.exports = initializePassport
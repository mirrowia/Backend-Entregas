const passport = require ("passport")
const local = require("passport-local")
const {userModel} = require("../models/user");
const {cartModel} = require("../models/cart");
const {createHash, isValidPassword, generateToken, authToken} = require ("../../utils")
const GitHubStrategy = require("passport-github2")
const config = require("./config")

const localStrategy = local.Strategy
const PRIVATE_KEY = config.privateKey

const initializePassport = () => {

    passport.use("login", new localStrategy({emailField: "email"}, async (email, password, done)=>{
            try {
                const user = await userModel.findOne({email: email})
                if (!user) return done(null, false)
                if(!isValidPassword(user, password)) return done(null, false)
                const accessToken = generateToken(user)
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
                    const user = await userModel.findOne({email: profile._json.email})
                    if(!user){
                        const newuser ={
                            name: profile._json.name,
                            lastname: "",
                            age: 18,
                            email: profile._json.email,
                            password: ""
                        }
                        let result = await userModel.create(newuser)
                        const cart = await cartModel.create({user: result._id, products: []})
                        result.cart = cart
                        result.save()
                        const accessToken = generateToken(result)
                        done(null, accessToken)
                    }else{
                        const accessToken = generateToken(user)
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
        const user = await userModel.findById(id)
        return done(null, user)
    })

}

module.exports = initializePassport
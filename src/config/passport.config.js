const passport = require ("passport")
const local = require("passport-local")
const {userModel} = require("../models/user");
const {cartModel} = require("../models/cart");
const {createHash, isValidPassword} = require ("../../utils")
const GitHubStrategy = require("passport-github2")

const localStrategy = local.Strategy

// const initializePassport = () => {

//     passport.use("register", new localStrategy(
//         {passReqToCallback: true,  usernameField: "username"}, async (req, username, password, done)=>{
//             const { name, lastname, age, email, cart, rol} = req.body
//             try {
//                 const user = await userModel.findOne({username})
//                 if(user) return done("User already exists")
//                 const newUser = {username, name, lastname, age, email, cart, password: createHash(password)}
//                 let result = await userModel.create(newUser)
//                 return done(null, result)
//             } catch (error) {
//                 return done("Error trying to get an user" + error)
//             }
//         }
//     ))

//     passport.use("login", new localStrategy({usernameField: "username"}, async (username, password, done)=>{
//             try {
//                 const user = await userModel.findOne({username})
//                 if (!user) return done(null, false)
//                 if(!isValidPassword(user, password)) return done(null, false)
//                 return done(null, user)
//             } catch (error) {
//                 done("Internal server error" + error)
//             }
//         }
//     ))
    

//     passport.serializeUser((user, done) =>{
//         return done(null, user._id);
//     })

//     passport.deserializeUser(async (id, done)=>{
//         const user = await userModel.findById(id)
//         return done(null, user)
//     })

// }

const initializePassport = () => {

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
                    username: profile._json.email,
                    password: ""
                }
                let result = await userModel.create(newuser)
                const cart = await cartModel.create({user: result._id, products: []})
                result.cart = cart
                result.save()
                done(null, result)
            }else{
                done(null, user)
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
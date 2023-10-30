const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const loginRouter = require("./routes/sessions");
const communityRouter = require("./routes/community");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const passport = require("passport");
const initializePassport = require("./config/passport");
const path = require("path");
const config = require("./config/config")
const http = require('http');
const configureSocket = require('./config/socketIo');


const app = express();
const server = http.createServer(app);
const PORT = 8080;

// HANDLEBARS CONFIGURATION
app.engine(
  "handlebars",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/",
    helpers: {
      eq: function (a, b, options) {
        return a === b ? true : false;
      },
    },
  })
);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MONGOOSE CONNECTION
mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log("Connected to Mongo Atlas DB");
  })
  .catch((error) => {
    console.log("Error!", error);
  });

// SOCKET.IO CONFIG
const io = configureSocket(server);

// COOKIEPARSER CONFIGURATION
app.use(cookieParser());

// PASSPORT CONFIGURATION
initializePassport(passport);
app.use(passport.initialize());

// API ROUTES
app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions/", loginRouter);
app.use("/api/community", communityRouter);

// SERVER LISTENING
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const productApiRouter = require("./routes/api/products");
const cartApiRouter = require("./routes/api/carts");
const loginApiRouter = require("./routes/api/sessions");
const usersApiRouter = require("./routes/api/users");
const mocksApiRouter = require("./routes/api/mocks")
const productUiRouter = require("./routes/ui/products");
const cartUiRouter = require("./routes/ui/carts");
const loginUiRouter = require("./routes/ui/sessions");
const communityUiRouter = require("./routes/ui/community");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const passport = require("passport");
const initializePassport = require("./config/passport");
const path = require("path");
const config = require("./config/config")
const http = require('http');
const configureSocket = require('./config/socketIo');

const logger = require('./config/logger');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');


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
    logger.info("Connected to Mongo Atlas DB");
  })
  .catch((error) => {
    logger.error(error);
  });

// SOCKET.IO CONFIG
const io = configureSocket(server);

// COOKIEPARSER CONFIGURATION
app.use(cookieParser());

// PASSPORT CONFIGURATION
initializePassport(passport);
app.use(passport.initialize());

// SWAGGER
const swaggerOptions = {
  definition:{
    openapi:'3.1.0',
    info:{
      title:"Documentación",
      description:"API para documentar Ecommerce"
    }
  },
  apis:[`${__dirname}/docs/*/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json());

// UI ROUTES
app.use("/shop/", productUiRouter);
app.use("/shop/carts", cartUiRouter);
app.use("/shop/sessions", loginUiRouter);
app.use("/shop/community", communityUiRouter);


// API ROUTES
app.use("/api/products", productApiRouter);
app.use("/api/carts", cartApiRouter);
app.use("/api/sessions/", loginApiRouter);
app.use("/api/users/", usersApiRouter);
app.use("/api/mocking/", mocksApiRouter)

// SERVER LISTENING
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
});

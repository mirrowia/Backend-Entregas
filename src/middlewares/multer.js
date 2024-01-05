const multer = require("multer");
const { decodedToken } = require("../utils");
const sessionService = require("../services/session");
const productService = require("../services/product");
const { logger } = require("../config/nodemailer");
const path = require("path");
const fs = require("fs");

const profiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // GET TOKEN SO I CRETE A FOLDER FOR EVERY USER
      const token = req.cookies.userToken;
      const userId = decodedToken(token)._id;
      const dest = path.join(__dirname, `../uploads/profiles/${userId}`);

      // CHECK IF THE FOLDER EXISTS
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      cb(null, dest);
    },
    filename: (req, file, cb) => {
      //const fileExtension =file.originalname.split(".")[file.originalname.split(".").length - 1];+
      const fileExtension = "jpeg";
      cb(null, `profile.${fileExtension}`);
    },
  }),
});

const products = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const productId = req.params.id;

      const dest = path.join(__dirname, `../uploads/products/${productId}`);

      // CHECK IF THE FOLDER EXISTS
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

      cb(null, dest);
    },
    filename: (req, file, cb) => {
      //const fileExtension = file.originalname.split(".")[file.originalname.split(".").length - 1];
      cb(null, `product.jpeg`);
    },
  }),
});

const documents = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // GET TOKEN SO I CRETE A FOLDER FOR EVERY USER
      const token = req.cookies.userToken;
      const userId = decodedToken(token)._id;
      const dest = path.join(__dirname, `../uploads/documents/${userId}`);

      // CHECK IF THE FOLDER EXISTS
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      cb(null, dest);
    },
    filename: (req, file, cb) => {
      if (file.originalname == "Identificacion.pdf") {
        cb(null, file.originalname);
      } else if (file.originalname == "Comprobante_de_domicilio.pdf") {
        cb(null, file.originalname);
      } else if (file.originalname == "Comprobante_de_estado_de_cuenta.pdf") {
        cb(null, file.originalname);
      } else {
        cb(new Error("Nombre de archivo no válido"));
      }
    },
  }),
  limits: { files: 3 },
});

module.exports = { profiles, products, documents };

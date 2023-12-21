const multer = require("multer");
const { decodedToken } = require("../utils");
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
      const fileExtension =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      cb(null, `profile.${fileExtension}`);
    },
  }),
});

const products = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = decodedToken(token)._id;
      cb(null, path.join(__dirname, `../uploads/${userId}/products`));
    },
    filename: (req, file, cb) => {
      const token = req.cookies.userToken;
      const userId = decodedToken(token)._id;
      const fileExtension =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      cb(null, file.originalname);
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
        cb(new Error('Nombre de archivo no válido'));
      }
    },
  }),
  limits: { files: 3 },
});

module.exports = { profiles, products, documents };

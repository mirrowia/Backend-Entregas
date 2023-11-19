const mailer = require("nodemailer")
const dotenv = require ("dotenv")

dotenv.config();

const transport = mailer.createTransport({
    service:"gmail",
    port: process.env.PORT_MAILER,
    auth:{
      user: process.env.USER_MAILER,
      pass: process.env.PASSWORD_MAILER
    }
  })

  module.exports = transport
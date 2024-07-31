const dotenv = require("dotenv");

const env = process.env.NODE_ENV || 'prod';
dotenv.config({ path: `.env.${env}` });

const config = {
    nodeEnv: process.env.NODE_ENV,
    privateKey: process.env.PRIVATE_KEY,
    mongoUrl: process.env.MONGODB_URL,
    portMailer: process.env.PORT_MAILER,
    userMailer: process.env.USER_MAILER,
    passwordMailer: process.env.PASSWORD_MAILER,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    baseUrl: process.env.BASE_URL
};

console.log(config)

module.exports = config;

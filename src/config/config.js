const dotenv = require ("dotenv")

dotenv.config();

const config = {
    mongoUrl: process.env.MONGODB_URL,
    privateKey: process.env.PRIVATE_KEY
};

module.exports = config;
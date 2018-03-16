require("dotenv").config();

let config = {
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
  }
};

module.exports = config;

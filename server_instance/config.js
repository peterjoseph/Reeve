require("dotenv").config({path: "config.env"});

let config = {
  build: {
    environment: process.env.NODE_ENV
  },
  development: {
    protocol: process.env.PROTOCOL,
    key: process.env.KEY,
    certificate: process.env.CERTIFICATE,
    frontendServer: process.env.FRONTENDSERVER,
    frontendPort: process.env.FRONTENDPORT,
    backendServer: process.env.BACKENDSERVER,
    backendPort: process.env.BACKENDPORT
  },
  environment: process.env.ENVIRONMENT,
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
  }
};

module.exports = config;

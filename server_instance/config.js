require("dotenv").config({ path: "config.env" });

let config = {
  build: {
    environment: process.env.NODE_ENV,
    protocol: process.env.PROTOCOL,
    key: process.env.KEY,
    certificate: process.env.CERTIFICATE,
    server: process.env.SERVER,
    port: process.env.PORT
  },
  environment: process.env.ENVIRONMENT,
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    schema: process.env.DB_SCHEMA
  },
  redis: {
    host: process.env.R_HOST,
    port: process.env.R_PORT,
    proxy: process.env.R_PROXY,
    secret: process.env.R_SECRET,
    resave: process.env.R_RESAVE,
    saveUninitialized: process.env.R_SAVE_UNINITIALIZED
  },
  sentry: {
    enabled: process.env.SENTRY_ENABLED,
    dns: process.env.SENTRY_DNS
  },
  papertrail: {
    enabled: process.env.PAPERTRAIL_ENABLED,
    host: process.env.PAPERTRAIL_HOST,
    port: process.env.PAPERTRAIL_PORT,
    hostname: process.env.PAPERTRAIL_HOSTNAME,
    level: process.env.PAPERTRAIL_LEVEL
  }
};

module.exports = config;

const config = require("../../config");
const stripe = require("stripe")(config.stripe.secretKey);

module.exports = {};

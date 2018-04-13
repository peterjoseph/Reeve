var express = require("express");
var path = require("path");
var subdomain = require("subdomain-router-middleware");
var INVALID_SUBDOMAINS = require("../shared/constants").INVALID_SUBDOMAINS;

// Define our express router object
let router = express.Router();

// Initialise default subdomain parameters
subdomain.init({
  asyncLoad: false,
  asyncFunc: null,
  invalid: INVALID_SUBDOMAINS,
  error: {
    success: false,
    message: "Invalid subdomain"
  }
});

router.get("/test", subdomain.route("subdomain"), function(req, res) {
  res.json({
    success: true,
    message: "Endpoint loaded successfully"
  });
});

module.exports = router;

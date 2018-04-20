let express = require("express");
let path = require("path");
let subdomain = require("subdomain-router-middleware");

// Define our express router object
let router = express.Router();

// Initialise default subdomain parameters
subdomain.init({
  asyncLoad: true,
  asyncFunc: function() {
    return new Promise((resolve, reject) => {
      // Server call to retrieve subdomain for security token
      const array = ["subdomain1", "subdomain2", "subdomain3"];
      resolve(array);
    });
  },
  error: {
    success: false,
    message: "Invalid subdomain"
  }
});

router.get("/test", subdomain.route(), function(req, res) {
  res.json({
    success: true,
    message: "Endpoint loaded successfully"
  });
});

module.exports = router;

let express = require("express");
let path = require("path");
let subdomain = require("subdomain-router-middleware");
let fs = require("fs");

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

// Recursively retrieve endpoints from routes folder
fs.readdirSync(path.join(__dirname, "../../server/controller")).forEach(function(file) {
	if (file.toLowerCase().indexOf(".js")) {
		require("../" + path.join("controller", file))(router);
	}
});

// Load index file for all other calls
router.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, "../../client/index.html"));
});

module.exports = router;

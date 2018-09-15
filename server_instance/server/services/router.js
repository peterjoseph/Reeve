let express = require("express");
let path = require("path");
let fs = require("fs");

// Define our express router object
let router = express.Router();

// Recursively retrieve endpoints from routes folder
fs.readdirSync(path.join(__dirname, "../controller")).forEach(function(file) {
	if (file.toLowerCase().indexOf(".js")) {
		require(path.join(__dirname, "../controller", file))(router);
	}
});

// Load index file for all other calls
router.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, "../../distribution/index.html"));
});

module.exports = router;

// Transpile server code to support ES6

require("babel-register")({
	presets: ["env"]
});

module.exports = require("./server.js");

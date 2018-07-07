let mysql = require("mysql2");
let config = require("../../config");

let connection = null;

function connect(done) {
	connection = mysql.createPool({
		host: config.database.host,
		user: config.database.username,
		password: config.database.password,
		database: config.database.schema
	});

	done();
}

function perform() {
	return connection;
}

module.exports = {
	connect: connect,
	perform: perform
};

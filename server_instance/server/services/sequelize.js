const Sequelize = require("sequelize");
let config = require("../../config");

let sequelize = null;

function connect(done) {
	sequelize = new Sequelize(config.database.schema, config.database.username, config.database.password, {
		host: config.database.host,
		dialect: "mysql",
		operatorsAliases: false,
		pool: {
			max: config.database.max,
			min: config.database.min,
			acquire: config.database.acquire,
			idle: config.database.idle
		}
	});
	done();
}

function perform() {
	return sequelize;
}

module.exports = {
	connect: connect,
	perform: perform
};

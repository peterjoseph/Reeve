import Sequelize from "sequelize";
import fs from "fs";
import path from "path";
import config from "../../config";

let connection = null;
let sqModels = {};

export function connect(done) {
	// Connect to database through Sequelize
	connection = new Sequelize(config.database.schema, config.database.username, config.database.password, {
		host: config.database.host,
		dialect: "mysql",
		pool: {
			max: config.database.max,
			min: config.database.min,
			acquire: config.database.acquire,
			idle: config.database.idle
		},
		logging: false
	});

	// Import models to sequelize from the models directory
	fs.readdirSync(path.join(__dirname, "../models")).forEach(function(file) {
		if (file.toLowerCase().indexOf(".js")) {
			var model = connection.import(path.join(__dirname, "../models", file));
			sqModels[model.name] = model;
		}
	});

	// Store models in object for retrieval
	Object.keys(sqModels).forEach(modelName => {
		if (sqModels[modelName].associate) {
			sqModels[modelName].associate(sqModels);
		}
	});

	// Notify once complete
	done();
}

export function database() {
	return connection;
}

export function models() {
	return sqModels;
}

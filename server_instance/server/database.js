let mysql = require("mysql");
let config = require("../config");

let connection = null;

exports.connect = function(done) {
  connection = mysql.createPool({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.schema
  });

  done();
};

exports.perform = function() {
  return connection;
};

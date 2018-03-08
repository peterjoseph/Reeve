// LOAD PACKAGES
let cluster = require('cluster');

// IMPORT MODULES

// IMPORT ROUTER
let routes = require('./router');

if (cluster.isMaster) {  
    let cpus = require('os').cpus().length;
    for (let i = 0; i < cpus; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker) {
        cluster.fork();
    });    
} else {
    let express = require('express'),
	app = express(),
	port = 3000,
	counter = 10000 + Math.round(Math.random() * 10000);
    app.listen(port);
}
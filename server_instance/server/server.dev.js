let webpack = require("webpack");
let webpackDevMiddleware = require("webpack-dev-middleware");
let webpackHotMiddleware = require("webpack-hot-middleware");
let webpackconfig = require("../webpack.config.js");
let webpackcompiler = webpack(webpackconfig);

function loadWebpack(app) {
	app.use(
		webpackDevMiddleware(webpackcompiler, {
			publicPath: webpackconfig.output.publicPath,
			stats: {
				modules: 0
			}
		})
	);
	app.use(webpackHotMiddleware(webpackcompiler));

	return app;
}

module.exports = loadWebpack;

let webpack = require("webpack");
let webpackDevMiddleware = require("webpack-dev-middleware");
let webpackHotMiddleware = require("webpack-hot-middleware");
let webpackConfig = require("../../webpack.config.js");
let webpackcompiler = webpack(webpackConfig);
let config = require("../../config");

function initialize(app) {
	if (config.build.environment !== "development") {
		return;
	}

	app.use(
		webpackDevMiddleware(webpackcompiler, {
			publicPath: webpackConfig.output.publicPath,
			hot: true,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*"
			},
			stats: {
				modules: 0
			}
		})
	);
	app.use(webpackHotMiddleware(webpackcompiler));

	return app;
}

module.exports = {
	initialize: initialize
};

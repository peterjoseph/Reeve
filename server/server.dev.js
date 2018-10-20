let webpack = require("webpack");
let webpackDevMiddleware = require("webpack-dev-middleware");
let webpackHotMiddleware = require("webpack-hot-middleware");
let webpackConfig = require("../webpack.config.js");
let webpackcompiler = webpack(webpackConfig);

function loadWebpack(app) {
	app.use(
		webpackDevMiddleware(webpackcompiler, {
			publicPath: webpackConfig.output.publicPath,
			stats: {
				modules: 0
			}
		})
	);
	app.use(webpackHotMiddleware(webpackcompiler));

	return app;
}

module.exports = loadWebpack;

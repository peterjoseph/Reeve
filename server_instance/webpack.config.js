let path = require("path");
let webpack = require("webpack");
let config = require("./config");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
let BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
let postcssPresetEnv = require("postcss-preset-env");

function loadPlugins() {
	var plugins = [];
	plugins.push(
		new webpack.ProvidePlugin({
			Promise: "imports-loader?this=>global!exports-loader?global.Promise!es6-promise",
			fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
		})
	);
	if (config.build.environment === "development") {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}
	if (config.build.environment === "production") {
		plugins.push(
			new UglifyJsPlugin({
				uglifyOptions: {
					warnings: false,
					compress: true,
					mangle: true,
					output: {
						comments: false,
						beautify: false
					},
					toplevel: false,
					keep_fnames: false
				}
			})
		);
	}
	if (config.development.analyzeBundle === true) {
		plugins.push(new BundleAnalyzerPlugin());
	}
	// Define sentry environmental variables for client
	plugins.push(
		new webpack.DefinePlugin({
			SENTRY_ENABLED: JSON.stringify(config.sentry.enabled),
			SENTRY_DSN: JSON.stringify(config.sentry.dns),
			BUILD_ENVIRONMENT: JSON.stringify(config.build.environment),
			BUILD_RELEASE: JSON.stringify(config.build.release)
		})
	);
	return plugins;
}

function loadEntryFile() {
	if (config.build.environment === "development") {
		return ["babel-polyfill", "whatwg-fetch", "./client/index.js", "webpack-hot-middleware/client", "webpack/hot/dev-server"];
	} else {
		return ["babel-polyfill", "whatwg-fetch", "./client/index.js"];
	}
}

module.exports = {
	mode: config.build.environment,
	entry: loadEntryFile(),
	output: {
		path: path.join(__dirname, "distribution"),
		filename: "bundle.js",
		publicPath: config.build.publicPath,
		hotUpdateChunkFilename: "hot/[id].[hash].hot-update.js",
		hotUpdateMainFilename: "hot/[hash].hot-update.json"
	},
	module: {
		rules: [
			{
				test: /.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ["es2015", "stage-0", "react"]
				}
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: () => [postcssPresetEnv()]
						}
					},
					{
						loader: "sass-loader"
					}
				]
			},
			{
				test: /.*\.(gif|png|jpe?g|svg)$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "/images/[name].[ext]",
							limit: 8192
						}
					}
				]
			}
		]
	},
	plugins: loadPlugins()
};

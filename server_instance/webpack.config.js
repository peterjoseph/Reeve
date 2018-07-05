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
	return plugins;
}

function loadEntryFile() {
	if (config.build.environment === "development") {
		return ["babel-polyfill", "./client/index.js", "webpack-hot-middleware/client", "webpack/hot/dev-server"];
	} else {
		return ["babel-polyfill", "./client/index.js"];
	}
}

module.exports = {
	mode: config.build.environment,
	entry: loadEntryFile(),
	output: {
		path: path.join(__dirname, "client", "distribution"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ["es2015", "react", "stage-0"]
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
						loader: "url-loader",
						options: {
							name: "/common/images/[name].[ext]",
							limit: 8192
						}
					}
				]
			}
		]
	},
	plugins: loadPlugins()
};

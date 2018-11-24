let path = require("path");
let webpack = require("webpack");
let config = require("./config");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
let BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
let postcssPresetEnv = require("postcss-preset-env");
let CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

function loadPlugins() {
	var plugins = [];
	plugins.push(
		new CaseSensitivePathsPlugin(),
		new webpack.ProvidePlugin({
			Promise: "imports-loader?this=>global!exports-loader?global.Promise!es6-promise",
			fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
		}),
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|it/)
	);
	if (config.build.environment === "development") {
		plugins.push(new webpack.HotModuleReplacementPlugin());
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
			BUILD_RELEASE: JSON.stringify(config.build.release),
			BUILD_PROTOCOL: JSON.stringify(config.build.protocol),
			BUILD_DOMAINPATH: JSON.stringify(config.build.domainPath)
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
	mode: config.build.environment !== "test" ? config.build.environment : "none",
	entry: loadEntryFile(),
	output: {
		path: path.join(__dirname, "distribution"),
		filename: "bundle.js",
		publicPath: config.build.publicPath,
		hotUpdateChunkFilename: "hot/[id].[hash].hot-update.js",
		hotUpdateMainFilename: "hot/[hash].hot-update.json"
	},
	optimization: {
		minimizer: [
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
		],
		mangleWasmImports: true
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
	plugins: config.build.environment !== "test" ? loadPlugins() : []
};

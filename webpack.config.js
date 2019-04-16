let path = require("path");
let webpack = require("webpack");
let config = require("./config");

function loadPlugins() {
	var plugins = [];
	plugins.push(
		// Define sentry environmental variables for client
		new webpack.DefinePlugin({
			BUILD_ENVIRONMENT: JSON.stringify(config.build.environment),
			BUILD_RELEASE: JSON.stringify(config.build.release),
			BUILD_PROTOCOL: JSON.stringify(config.build.protocol),
			BUILD_DOMAINPATH: JSON.stringify(config.build.domainPath),
			GOOGLE_ANALYTICS_ENABLED: JSON.stringify(config.googleAnalytics.enabled),
			GOOGLE_ANALYTICS_TRACKING: JSON.stringify(config.googleAnalytics.tracking),
			STRIPE_ENABLED: JSON.stringify(config.stripe.enabled),
			STRIPE_API_KEY: JSON.stringify(config.stripe.apiKey),
			SENTRY_ENABLED: JSON.stringify(config.sentry.enabled),
			SENTRY_DSN: JSON.stringify(config.sentry.dns)
		}),
		new webpack.ProvidePlugin({
			Promise: "imports-loader?this=>global!exports-loader?global.Promise!es6-promise",
			fetch: "exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd"
		}),
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|it/)
	);

	if (config.build.environment === "production") {
		let TerserPlugin = require("terser-webpack-plugin");
		let CompressionPlugin = require("compression-webpack-plugin");
		plugins.push(
			new TerserPlugin({
				terserOptions: {
					warnings: false,
					compress: true,
					mangle: true,
					output: {
						comments: false,
						beautify: false
					},
					toplevel: false,
					keep_fnames: false,
					ie8: false,
					keep_classnames: undefined,
					safari10: false
				}
			}),
			new CompressionPlugin({
				filename: "[path].gz[query]",
				algorithm: "gzip",
				test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
				threshold: 10240,
				minRatio: 0.8
			})
		);
	}
	if (config.build.environment === "development") {
		let CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
		plugins.push(new CaseSensitivePathsPlugin(), new webpack.HotModuleReplacementPlugin());

		// Import BundleAnalyzer Plugin
		if (config.development.analyzeBundle === true) {
			let BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
			plugins.push(new BundleAnalyzerPlugin());
		}
	}
	return plugins;
}

module.exports = {
	mode: config.build.environment !== "test" ? config.build.environment : "none",
	entry: () => {
		if (config.build.environment === "development") {
			return ["@babel/polyfill", "whatwg-fetch", "./client/index.js", "webpack-hot-middleware/client", "webpack/hot/dev-server"];
		} else {
			return ["@babel/polyfill", "whatwg-fetch", "./client/index.js"];
		}
	},
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
					presets: ["@babel/preset-env", "@babel/preset-react"]
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
							plugins: () => {
								let postcssPresetEnv = require("postcss-preset-env");
								return [postcssPresetEnv()];
							}
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

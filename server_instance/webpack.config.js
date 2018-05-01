var path = require("path");
var webpack = require("webpack");

function loadPlugins() {
  var plugins = [];
  plugins.push(
    new webpack.ProvidePlugin({
      Promise:
        "imports-loader?this=>global!exports-loader?global.Promise!es6-promise",
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    })
  );
  if (process.env.NODE_ENV === "development") {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  return plugins;
}

function loadEntryFile() {
  if (process.env.NODE_ENV === "development") {
    return [
      "babel-polyfill",
      "./client/index.js, 'webpack-hot-middleware/client', 'webpack/hot/dev-server'"
    ];
  } else {
    return ["babel-polyfill", "./client/index.js"];
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: loadEntryFile(),
  output: {
    path: path.join(__dirname, "client"),
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
              name: "/common/images/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: loadPlugins()
};

let webpack = require("webpack");
let webpackDevMiddleware = require("webpack-dev-middleware");
let webpackHotMiddleware = require("webpack-hot-middleware");
let webpackconfig = require("../webpack.dev.config.js");
let webpackcompiler = webpack(webpackconfig);

function loadWebpack(app) {
  app.use(
    webpackDevMiddleware(webpackcompiler, {
      publicPath: webpackconfig.output.publicPath,
      stats: {
        colors: false,
        chunks: false,
        "errors-only": true
      }
    })
  );
  app.use(
    webpackHotMiddleware(webpackcompiler, {
      log: console.log
    })
  );

  return app;
}

module.exports = loadWebpack;

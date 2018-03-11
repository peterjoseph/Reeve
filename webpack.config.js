var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './client/index.js',
    './common/styles/style.css'
  ],
  entry: [
    'whatwg-fetch',
    path.join(__dirname, 'client', 'index.js')
  ],
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    },
    {
      test: /.*\.(gif|png|jpe?g|svg)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '/common/images/[name].[ext]',
          }
        },
      ]
    }]
  },
  plugins: [  
      new webpack.ProvidePlugin({
            Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
            fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
      })
  ]
}
// reference: https://webpack.js.org/concepts/configuration/#simple-configuration
const path = require('path');
module.exports = {
  mode: 'development', // productionにしたい場合はコマンドラインで上書き可能
  entry: {main: './src/js/index.js'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_bundle.js'
  },
  resolve: {
    alias: {
      modules: path.join(__dirname, 'node_modules'),
      common: path.join(__dirname, 'common')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/i,
        use: ['url-loader']
      }
    ]
  },
  performance: {
    hints: false
  }
};

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: { index: "./src/js/index.js" },
  resolve: {
    alias: {
      modules: __dirname + "/node_modules",
      common: __dirname + "/common"
    }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      // https://webpack.js.org/plugins/terser-webpack-plugin/#preserve-comments
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@license/i
          }
        }
      })
    ]
  }
};

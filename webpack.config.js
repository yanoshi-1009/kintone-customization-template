module.exports = {
  mode: 'development', // productionにしたい場合はコマンドラインで上書き可能
  entry: {index: './src/js/index.js'},
  resolve: {
    alias: {
      modules: __dirname + '/node_modules',
      common: __dirname + '/common'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {url: false}
          },
          'sass-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/i,
        type: 'asset'
      }
    ]
  }
};

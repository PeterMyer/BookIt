require('dotenv').config();

module.exports = {
  mode: process.env.DEV ? 'development' : 'production',
  entry: {
    bundle: __dirname + '/client/index.js',
  },
  output: {
    path: __dirname,
    filename: './public/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  devtool: false,
  // 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'public/assets',
              publicPath: '/assets',
            },
          },
        ],
      },
    ],
  },
};

const path = require('path');

module.exports = {
  entry: './components/Dummy.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dummy.webcomponent.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /(\.ya?ml$)|\.publicodes/,
        use: 'yaml-loader',
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

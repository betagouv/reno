const path = require('path')

/*
 * This file is used to create a webcomponent. We couldn't find a way to do this with Nextjs.
 * We use React to share our compiler between Next and the webco generation.
 * We do this outside of the Nextjs conf to avoid breaking it, even if in theory it could be possible.
 *
 * Run with `npx webpack --config webpack.config.js`
 *
 */

module.exports = {
  entry: './components/Dummy.webcomponent.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'Dummy.webcomponent.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
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
}

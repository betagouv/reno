const path = require('path')
const webpack = require('webpack')

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
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
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
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /next\/link/,
      // Replace with the path to your custom implementation or a simple <a> tag wrapper
      // For example, you could create a file that exports a simple <a> tag component
      // and use that path here.
      // Example: path.resolve(__dirname, './components/MyLink.js')
      // For demonstration, let's assume you have a custom link component
      // that you want to use instead of next/link.
      // Note: You need to provide the actual path to your custom component.
      require.resolve('./components/Link.webcomponent.tsx'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@\/components\/useSetSearchParams/,
      // Replace with the path to your custom implementation or a simple <a> tag wrapper
      // For example, you could create a file that exports a simple <a> tag component
      // and use that path here.
      // Example: path.resolve(__dirname, './components/MyLink.js')
      // For demonstration, let's assume you have a custom link component
      // that you want to use instead of next/link.
      // Note: You need to provide the actual path to your custom component.
      require.resolve('./components/useSetSearchParams.webcomponents.ts'),
    ),
  ],
}

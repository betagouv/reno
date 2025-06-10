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

  resolve: { fallback: { stream: false, zlib: false } },
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
            plugins: ['styled-components'],
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
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
      /next\/image/,
      require.resolve('./components/Image.webcomponent.tsx'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@socialgouv\/matomo-next/,
      require.resolve('./components/matomo.webcomponent.ts'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /next\/navigation/,
      require.resolve('./components/navigation.webcomponent.ts'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@\/components\/getAppUrl/,
      require.resolve('./components/getAppUrl.webcomponent.ts'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@\/components\/useSetSearchParams/,
      require.resolve('./components/useSetSearchParams.webcomponent.ts'),
    ),
    new webpack.NormalModuleReplacementPlugin(/@\/app\/public/, function (
      resource,
    ) {
      // Replace the original directory with the new directory
      resource.request = resource.request.replace(/@\/app\/public/, '/public') // should resolve() ?
    }),
    new webpack.NormalModuleReplacementPlugin(/@\//, function (resource) {
      // Replace the original directory with the new directory
      resource.request = resource.request.replace(/@\//, '/') // should resolve() ?
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}

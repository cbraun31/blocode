const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 1. Import the plugin

module.exports = {
  mode: 'development', // Use 'production' for final builds
  entry: './src/main.ts', // The entry point of your application
  output: {
    filename: 'bundle.js', // The name of the output bundle
    path: path.resolve(__dirname, 'dist'), // The output directory
    clean: true, // Clean the 'dist' folder before each build
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Look for .ts or .tsx files
        use: 'ts-loader', // Use ts-loader to compile them
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Use our html file as a template
    }),
    // 2. Add the plugin to your plugins array
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' } // Copies src/assets to dist/assets
      ]
    })
  ],
  devServer: {
    static: './dist', // Serve files from the 'dist' directory
    open: true, // Automatically open the browser
  },
};
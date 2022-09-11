const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, ".."),
  mode: isDevelopment ? "development" : "production",
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  // plugins: [new ReactRefreshWebpackPlugin()],
};

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";
module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  // plugins: [new ReactRefreshWebpackPlugin()],
};

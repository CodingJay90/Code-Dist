const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || "/";
const isDevelopment = process.env.NODE_ENV !== "production";
const basicSyntaxColorizationLanguages =
  "XML, PHP, C#, C++, Razor, Markdown, Diff, Java, VB, CoffeeScript, Handlebars, Batch, Pug, F#, Lua, Powershell, Python, Ruby, SASS, R, Objective-C"
    .toLowerCase()
    .replace(" ", "")
    .split(",");
const richIntelliSenseLanguages =
  "TypeScript, JavaScript, CSS, LESS, SCSS, JSON, HTML"
    .toLowerCase()
    .replace(" ", "")
    .split(",");

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/index.tsx"),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, "..", "tsconfig.json"),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "..", "./build"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "public", "index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
    }),
    new MonacoWebpackPlugin({
      languages: [
        "abap",
        "aes",
        "apex",
        "azcli",
        "bat",
        "bicep",
        "c",
        "cameligo",
        "clojure",
        "coffeescript",
        "cpp",
        "csharp",
        "csp",
        "css",
        "cypher",
        "dart",
        "dockerfile",
        "ecl",
        "elixir",
        "flow9",
        "freemarker2",
        "freemarker2.tag-angle.interpolation-bracket",
        "freemarker2.tag-angle.interpolation-dollar",
        "freemarker2.tag-auto.interpolation-bracket",
        "freemarker2.tag-auto.interpolation-dollar",
        "freemarker2.tag-bracket.interpolation-bracket",
        "freemarker2.tag-bracket.interpolation-dollar",
        "fsharp",
        "go",
        "graphql",
        "handlebars",
        "hcl",
        "html",
        "ini",
        "java",
        "javascript",
        "json",
        "julia",
        "kotlin",
        "less",
        "lexon",
        "liquid",
        "lua",
        "m3",
        "markdown",
        "mips",
        "msdax",
        "mysql",
        "objective-c",
        "pascal",
        "pascaligo",
        "perl",
        "pgsql",
        "php",
        "pla",
        "plaintext",
        "postiats",
        "powerquery",
        "powershell",
        "proto",
        "pug",
        "python",
        "qsharp",
        "r",
        "razor",
        "redis",
        "redshift",
        "restructuredtext",
        "ruby",
        "rust",
        "sb",
        "scala",
        "scheme",
        "scss",
        "shell",
        "sol",
        "sparql",
        "sql",
        "st",
        "swift",
        "systemverilog",
        "tcl",
        "twig",
        "typescript",
        "vb",
        "verilog",
        "xml",
        "yaml",
      ],
      // languages: ["javascript", "css", "html", "typescript", "json"],
      // languages: richIntelliSenseLanguages.concat(
      //   basicSyntaxColorizationLanguages
      // ),
      // languages: richIntelliSenseLanguages.concat(
      //   basicSyntaxColorizationLanguages
      // ),
    }),
  ],
  stats: "errors-only",
};

const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

const {
  NoEmitOnErrorsPlugin
} = require('webpack');
const {
  GlobCopyWebpackPlugin,
  BaseHrefWebpackPlugin
} = require('@angular/cli/plugins/webpack');
const {
  CommonsChunkPlugin
} = require('webpack').optimize;
const {
  AotPlugin
} = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "vendor", "main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";

var ENV = process.env.npm_lifecycle_event;

const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: {
      remove: (comment) => !importantCommentRe.test(comment)
    }
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        } else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        } else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};




let config = {
  "devtool": "source-map",
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      "./src" + path.sep + "main.ts"
    ],
    "polyfills": [
      "./src" + path.sep + "polyfills.ts"
    ],
    "styles": [
      "./src" + path.sep + "scss" + path.sep + "main.scss"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), ".." + path.sep + "server" +
      path.sep + "public"),
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js",
    "publicPath": "/test_happinesscard"
  },
  "module": {
    "rules": [{
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /\/node_modules\//
        ]
      },
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [{
              loader: 'css-loader?url=false',
              query: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ],
        })
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader?url=false', 'sass-loader'])
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader'
      }, {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      "template": "./src" + path.sep + "index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": "body",
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        } else if (leftIndex < rightindex) {
          return -1;
        } else {
          return 0;
        }
      }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "name": "inline",
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": "vendor",
      "minChunks": (module) => module.resource &&
        (module.resource.startsWith(nodeModules) || module.resource.startsWith(genDirNodeModules)),
      "chunks": [
        "main"
      ]
    }),
    new AotPlugin({
      "mainPath": "main.ts",
      "exclude": [],
      "tsConfigPath": "src" + path.sep + "tsconfig.app.json",
      "skipCodeGeneration": true
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true
    }),
    new CopyWebpackPlugin([{
      from: __dirname + '/src/images',
      to: path.join(process.cwd(), ".." + path.sep + "server" + path.sep + "public" +
        path.sep + "src" + path.sep + "images")
    }]),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.jQuery': "jquery"
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  },
  "devServer": {
    "historyApiFallback": true
  }
};

const ifdefOpts = {
  build: (ENV === 'build'),
  version: 3,
  "ifdef-verbose": true, // add this for verbose output
  "ifdef-triple-slash": true // set false to use double slash comment instead of default triple slash
};
const ifdefQ = require('querystring').encode({
  json: JSON.stringify(ifdefOpts)
});

config.module.rules.push({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loaders: ["@ngtools/webpack", `ifdef-loader?${ifdefQ}`]
});

module.exports = config;

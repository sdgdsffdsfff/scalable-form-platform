import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import {dependencies} from "./package";

const isDevelopment = (process.env.NODE_ENV === 'development');
const isProduction = !isDevelopment;

const devtool = isDevelopment ? 'source-map' : undefined;
const mode = isDevelopment ? 'development' : 'production';
const entry = isDevelopment ? [
  path.join(__dirname, './src/index.ts')
] : [
  path.join(__dirname, './src/index.ts')
];
const output = {
  path: path.join(__dirname, './dist/'),
  filename: isDevelopment ? 'index.js' : 'index.js',
  libraryTarget: 'commonjs2'
};
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
fs.readdirSync(path.join(__dirname, '../../node_modules'))
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
delete nodeModules['xform-server'];
const externals = nodeModules;
const module = {
  rules: [
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader?cacheDirectory',
        options: {
          presets: [['react-app', {flow: false, typescript: true}]],
          plugins: [
            ["@babel/plugin-proposal-decorators", {"legacy": true}]
          ]
        }
      }
    }
  ]
};

export default {
  target: 'node',
  stats: 'errors-only',
  devtool,
  mode,
  entry,
  output,
  externals,
  module,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  node: {
    __dirname: false,
    __filename: false,
    fs: "empty",
    tls: "empty"
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: isProduction ? 'production' : 'development',
      ADMIN_PATH: isProduction ? 'https://g.alicdn.com/xform/xform-open/0.0.1/admin.js' : 'http://localhost:3001/assets/admin.js',
      PORTAL_PATH: isProduction ? 'https://g.alicdn.com/xform/xform-open/0.0.1/portal.js' : 'http://localhost:3001/assets/portal.js',
      PORTAL_MOBILE_PATH: isProduction ? 'https://g.alicdn.com/xform/xform-open/0.0.1/portal-mobile.js' : 'http://localhost:3001/assets/portal-mobile.js',
      SET_PATH: isProduction ? 'https://g.alicdn.com/xform/xform-open/0.0.1/setup.js' : 'http://localhost:3001/assets/setup.js',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new webpack.NormalModuleReplacementPlugin(
      /\.(css|less)$/,
      'node-noop'
    )
  ]
};

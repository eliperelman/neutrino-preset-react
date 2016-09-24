'use strict';

const preset = require('neutrino-preset-web');
const merge = require('deepmerge');
const webpackMerge = require('webpack-merge').smart;
const path = require('path');

const MODULES = path.join(__dirname, 'node_modules');
const eslintLoader = preset.module.preLoaders[0];
const babelLoader = preset.module.loaders.find(l => l.loader && l.loader.includes('babel'));

eslintLoader.test = /\.jsx?$/;
babelLoader.test = /\.jsx?$/;
babelLoader.query.presets.push(require.resolve('babel-preset-stage-0'));
babelLoader.query.presets.push(require.resolve('babel-preset-react'));

const config = webpackMerge(preset, {
  eslint: {
    configFile: path.join(__dirname, 'eslint.js')
  },
  resolve: {
    fallback: [MODULES]
  },
  resolveLoader: {
    fallback: [MODULES]
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  }
});

if (process.env.NODE_ENV === 'development') {
  const reactHotLoader = merge(babelLoader, {
    loader: require.resolve('react-hot-loader'),
    query: null
  });

  reactHotLoader.test = /\.(js|jsx)$/;
  // react-hot-loader needs to go before babel since
  // webpack evaluates loaders from bottom-to-top
  config.module.loaders.unshift(reactHotLoader);
}

module.exports = config;

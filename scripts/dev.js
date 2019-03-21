process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

require('../config/env');
const path = require('path');

const fs = require('fs-extra');
const paths = require('../config/paths');
const webpack = require('webpack');
//const config = require('react-scripts/config/webpack.config.dev.js');

const configFactory = require('../config/webpack.config.dev');
const config = configFactory('development');

// removes react-dev-utils/webpackHotDevClient.js at first in the array

config.entry.shift();

webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.error(stats.toString({
    chunks: false,
    colors: true
  }));
});

function copyPublicFolder() {

  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}
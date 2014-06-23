'use strict';

module.exports = function (config) {
  return new module.exports.nodeConsole(config);
};

module.exports.nodeConsole = require('./lib/console');

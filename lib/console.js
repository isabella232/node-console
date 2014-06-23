var repl = require('repl');
var Colors = require('colors');
var fs = require('fs');
//var configFile = '../../lob-api/consoleConfig.js';

// console.log(configFile);

var nodeConsole = function (config) {
  this.config = config;
  this.loadModels(this.config.models);

  var r = repl.start({
    prompt: 'console > ',
    useGlobal: true
  });

  r.on('exit', function () {
    process.exit();
  });
};

nodeConsole.prototype.loadModels = function (modelDir) {
  fs.readdirSync(process.cwd() + modelDir).forEach(function (fileName) {
    var model = require(process.cwd() + '/' + modelDir + '/' + fileName);
    for (var k in model) {
      if (k === 'Object') {
        console.log(('You cannot name a model: ' + k +
          ' it is a reserved word.').red);
      } else {
        global[k] = model[k];
      }
    }
  });
};

module.exports = nodeConsole;

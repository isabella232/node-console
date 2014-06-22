var repl = require('repl');
var fs = require('fs');
var configFile = '../../lob-api/consoleConfig.js';

// console.log(configFile);

function nodeConsole() {

  this.config = require(configFile);
  // loadModels('../lob-api/' + dataJSON.directories.models);
  var p = '../lob-api/src/models/';
  this.loadModels(p);
  var connection = config.connection;
  for (var k in connection) {
    process.env[k] = connection[k];
  }

  var r = repl.start({
    prompt: 'console > ',
    useGlobal: true
  });

  r.on('exit', function () {
    process.exit();
  });
}

nodeConsole.prototype.loadModels = function (modelDir) {
  fs.readdirSync(modelDir).forEach(function(fileName) {
    var model = require('../' + modelDir + fileName);
    for (var k in model) {
      if (k === 'Object') {
        console.log('You cannot name a model: ' + k + ' it is a reserved word');
      } else {
        global[k] = model[k];
      }
    }
  });
};

exports.nodeConsole = nodeConsole;

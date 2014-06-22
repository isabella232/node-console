var repl = require('repl');
var fs = require('fs');
var configFile = '../../lob-api/consoleConfig.js';

// console.log(configFile);

function nodeconsole() {
  var config = require(configFile);
  // loadModels('../lob-api/' + dataJSON.directories.models);
  var p = '../lob-api/src/models/';
  loadModels(p);
  var connection = config.connection;
  for (k in connection) {
    process.env[k] = connection[k];
  }

  var nodeConsole = repl.start({
    prompt: "NodeConsole > ",
    useGlobal: true
  });

  function loadModels (models) {
    fs.readdirSync(models).forEach(function(fileName) {
      var model = require('../' + models + fileName);
      for (var k in model) {
        if (k === 'Object') return;
        global[k] = model[k];
      }
    });
  }

  nodeConsole.on('exit', function () {
    process.exit();
  });
}

exports.nodeconsole = nodeconsole;

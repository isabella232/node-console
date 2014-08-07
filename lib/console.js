var repl = require('repl');
var Colors = require('colors');
var fs = require('fs');
var vm = require('vm');
var Promise = require('bluebird');
//var configFile = '../../lob-api/consoleConfig.js';

// console.log(configFile);

var nodeConsole = function (config) {
  this.config = config;
  this.loadModels(this.config.models);

  var r = repl.start({
    prompt: 'console > ',
    eval: function (code, context, file, cb) {
      var self = this;

      function isRecoverableError (e) {
        return e &&
            e.name === 'SyntaxError' &&
            /^(Unexpected end of input|Unexpected token :)/.test(e.message);
        }

      function Recoverable (err) {
        this.err = err;
      }

      var err;
      var result;
      // first, create the Script object to check the syntax
      try {
        var script = vm.createScript(code, {
          filename: file,
          displayErrors: false
        });
      } catch (e) {

        if (isRecoverableError(e)) {
          err = new Recoverable(e);
        } else {
          err = e;
        }

      }

      if (!err) {
        try {
          if (self.useGlobal) {
            result = script.runInThisContext({displayErrors: false});
          } else {
            result = script.runInContext(context, {displayErrors: false});
          }
        } catch (e) {
          err = e;
          if (err && process.domain) {
            process.domain.emit('error', err);
            process.domain.exit();
            return;
          }
        }
      }

      if (result && typeof result.then === 'function') {
        result.then(function (output) {
         cb(err, output.toJSON());
       });
     } else {
       cb(err, result);
     }

    },
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

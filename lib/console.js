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
    useGlobal: true,
    eval: defaultEval
  });

  r.on('exit', function () {
    process.exit();
  });
};

function defaultEval(code, context, file, cb) {
  // var promise = code + '.then(function (model) { console.log() })';
  // console.log(newcode);
  var result = eval('var user = new User().fetch()');
  // console.log(codeResult);
  // var result = codeResult.then(function (model) {
  //   return model.toJSON();
  // });
  console.log(result);
  //var result = eval(newcode);
  //console.log(promise);
  var err;
    cb(err, result);
}

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

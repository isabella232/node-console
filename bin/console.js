#!/usr/bin/env node
const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));

const nodeConsole = new Liftoff({
  name: 'node-console',
  moduleName: 'node-console',     // these are assigned
  configName: 'consolefile', // automatically by
//  processTitle: 'hacker',   // the "name" option
  extensions: require('interpret').extensions
  // ^ automatically attempt to require module for any javascript variant
  // supported by interpret.  e.g. coffee-script / livescript, etc
}).on('require', function (name, module) {
  console.log('Loading:',name);
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
});

nodeConsole.launch({
  cwd: argv.cwd,
  configPath: argv.consolefile,
  require: argv.require,
  completion: argv.completion,
  verbose: argv.verbose
}, invoke);

function invoke (env) {
  if (argv.verbose) {
    console.log('LIFTOFF SETTINGS:', this);
    console.log('CLI OPTIONS:', argv);
    console.log('CWD:', env.cwd);
    console.log('LOCAL MODULES PRELOADED:', env.require);
    console.log('SEARCHING FOR:', env.configNameRegex);
    console.log('FOUND CONFIG AT:',  env.configPath);
    console.log('CONFIG BASE DIR:', env.configBase);
    console.log('YOUR LOCAL MODULE IS LOCATED:', env.modulePath);
    console.log('LOCAL PACKAGE.JSON:', env.modulePackage);
    console.log('CLI PACKAGE.JSON', require('../package'));
  }

  if (env.configPath) {
    process.chdir(env.configBase);
    require(env.configPath);
  } else {
    console.log('No consolefile found.');
  }

  // var nodeConsoleInstance = require(env.modulePath)(env.configPath);
  console.log(env.configPath);
  //console.log(configstuff.connection);
  require('../index')(require(env.configPath));
}

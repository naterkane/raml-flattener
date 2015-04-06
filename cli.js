#!/usr/bin/env node

console.log('cli support coming soon');
return;

var cli = require('cli');
var flattener = require('index.js');



cli.parse({
  filein: ['-i', 'Raml file to be parsed', 'file', './file.raml'],
  fileout: ['-o', 'Name of flattened Raml file to be written', 'file', './file-flat.raml']

});
process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
});
#!/usr/bin/env node

var cli = require('cli');
var raml = require('raml-parser');
var _ = require('lodash');
var fs = require('fs');


module.exports = Flattener;

function Flattener(infile, outfile){

  if (!infile){ return new Error('you must supply a .raml file for parsing'); }
  /**
   * generate output path if unspecified
   */
  if (!outfile) {
    outfile = infile.split('/');
    outfile = outfile.join('/').split('.').join('-flat.');
  }
  /**
   * generate basepath
   */
  var basepath = infile.split('/').shift() + '/',
      output;
  console.log('importing ' + infile + ' and parsing to ' + outfile + ' with resources from ' + basepath);

  raml.composeFile(infile).then(function(rootNode) {
    var doclines = (rootNode.start_mark.buffer + '\n').split('\n'),
        newdoc = [],
        c = 0,
        msg = '';

    _.forOwn(doclines,function(line) {
      c++;
      var include,
          buffer,
          includelines = [],
          d = 0;
      //console.log(line);
      if (line.match(/\!include\s(.*)/)) {
        console.log(c + ' found a line');
        if (!msg){
          msg = 'importing external files for ' + doclines.length + ' lines';
          console.log(msg);
        }
        console.info('line ' + c + ': importing ' + basepath + line.match(/\!include\s(.*)/)[0].split(' ')[1]);
        if(include = fs.readFileSync(basepath + line.match(/\!include\s(.*)/)[0].split(' ')[1], 'utf8')){
          console.log('yes');
        } else {
          console.log('no');

        }
        console.log('ok let\'s calculate buffer');
        /**
         * let's maintain our indentation since raml is yaml-ish it's important
         */
        buffer = line.match(/^\s{0,100}/)[0] + '  '; // add two spaces (or four?) - need to check raml spec
        includelines = include.split('\n');


        _.forOwn(includelines, function(iline){
          includelines[d++] = buffer + iline;//iline.replace(/^/,buffer);
        });
        include = includelines.join('\n');
        line = line.replace(/\!include\s(.*)/, '|\n' + include);

      }
      if(newdoc.push(line)){
        console.log('pushed ' + (d+1) + ' line(s)');
      }
    });
    console.log('done loop');
    var output = newdoc.join('\n');
    //console.log('output ' + output);
    fs.writeFile(outfile,output, 'utf8',function(err) {
          if (err) {
            console.warn(err);
            //exit;
          }
          console.info('done!');
          //console.log(newdoc.join('\n'));
        }
    );
    //console.log(newdoc);
    /*console.log(data.resources[0].methods[0].responses[200]);
     console.log(data.resources[0].resources.length);
     console.dir(data.resources[0]);
     console.log('top level: ' + data.resources.length);
     console.dir(data);
     rootNode.resources.forEach(function(r){
     console.log('2nd level: ' + r.resources.length);
     console.dir(r);

     });
     //console.log(JSON.stringify(data, null, 1));
     //console.dir(data);*/
  }, function(error) {
    console.error(error);
  });

}
//test it here
var flat = new Flattener('example/ecfs.raml');
//console.log(fs.readFileSync('example/schemas/filingsDefinition.json','utf8'));
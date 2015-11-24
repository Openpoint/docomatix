#!/usr/bin/env node

var path=require('path');
var fs=require('fs');
var rootdir=path.resolve(__dirname,'../../');
var execSync = require('child_process').execSync;

function create(){
	
}

try {
	fs.statSync(rootdir+'/dmx_config.json');
	var confpath=rootdir+'/dmx_config.json';
	var settings=JSON.parse(fs.readFileSync(confpath,'UTF8'));
	console.log('\nCreating documents at "'+path.resolve(rootdir,settings.opts.destination)+'".\n');
	var command = rootdir+'/node_modules/docomatix/node_modules/.bin/jsdoc --configure '+confpath;
	var demo = false;
}
catch(e){
	var confpath=__dirname+'/demo/dmx_config.json';
	var settings=JSON.parse(fs.readFileSync(confpath,'UTF8'));
	console.log('\nCreating sample documents at "'+rootdir+'/dmx_demo".\n');
	var command = rootdir+'/node_modules/docomatix/node_modules/.bin/jsdoc --configure '+confpath+' --verbose';
	var demo=true;
}

var doclocation=path.resolve(rootdir,settings.opts.destination);

try {
	fs.statSync(doclocation);
	var del=execSync('rm -r '+doclocation);
}
catch(e){}

	
var create = execSync(command,{cwd:rootdir});
console.log(create.toString('utf8'));

if(demo){
	require('docomatix/demo/demo_server.js');
}


"use strict";

/**
 * A demo template to serve a document instance from Node using express
 * @module demo
 * @chapter server
 * 
 * 
 * */

/**
 * @external
 * */
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var op = require('openport');

global.dmatix={};
dmatix.docLocation = path.resolve(__dirname,'../../../dmx_demo');


app.get(['/help', '/help/*'], function(req, res){
	res.sendFile(dmatix.docLocation+'/');
})

app.use(express.static(dmatix.docLocation));
app.use(express.static(path.resolve(__dirname,'../../../node_modules/docomatix')));
app.use(express.static(path.resolve(__dirname,'../../../node_modules/docomatix/node_modules')));

op.find(
	{
		startingPort: 8080,
		endingPort: 9080,
	},
	function(err, port) {
		if(err) { console.log(err); return; }
		server.listen(port, function(){
			console.log('Docomatix is listening for connections on port:'+port)
		});
	}
);
require('./search/parse.js');


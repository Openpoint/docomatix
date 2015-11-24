"use strict";

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var port = 8082;

var docLocation = path.resolve(__dirname,'../../../dmx_demo');
console.log(docLocation);

app.get(['/help', '/help/*'], function(req, res){
	res.sendFile(docLocation+'/');
})

app.use(express.static(docLocation));
app.use(express.static(path.resolve(__dirname,'../../../node_modules/docomatix')));
app.use(express.static(path.resolve(__dirname,'../../../node_modules/docomatix/node_modules')));

server.listen(port, function(){
	console.log('Docomatix is listening for connections on port:'+port)
});

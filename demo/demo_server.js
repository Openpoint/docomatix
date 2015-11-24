"use strict";

var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8082;

var docLocation='/documents';

app.get(['/help', '/help/*'], function(req, res){
	res.sendFile(__dirname + docLocation);
})

app.use(express.static(__dirname + docLocation));

server.listen(port, function(){
	console.log('Docomatix is listening for connections on port:'+port)
});

"use strict";

console.log('Parsing files for help index');

var parse5 = require('parse5');
var http = require('http');
var fs = require('fs');
var path = require('path');


var ftext;
var index=[];

function getAtt(att,name){
	return att.find(function (d) {
		return d.name === name;
	}).value;	
}

function parse(stream,file){
	ftext='';
	var chap;
	var kind;

	var parser = new parse5.SAXParser({locationInfo:true});
	
	stream.pipe(parser).on('finish', function(){
		if(chap){
			index.push({file:file,chapter:chap,kind:kind,data:ftext});
		}
				
		if(count < allFiles.length){
			html=fs.createReadStream(dmatix.docLocation+'/'+allFiles[count]);
			parse(html,allFiles[count]);

		}else{
			dmatix.searchIndex=index;
			//console.log(dmatix.searchIndex);
		}
		count++
	});
	parser.on('text', function(text,location) {
		if(chap){
			text=text.replace(/(\r\n|\n|\r)/gm," ");
			text=text.replace(/\s+/g," ");
			if(text!==" "){
				ftext=ftext+text+" ";
			}
		}
			
	});
	parser.on('startTag', function(name, attributes, selfClosing, location) {

		if(name==='var'){
			chap=getAtt(attributes,'data-chapter') || 'unknown';
			kind=getAtt(attributes,'data-kind') || 'unknown';			
		}
	 
	});
}

var allFiles = fs.readdirSync(dmatix.docLocation);
var count=0;
var html=fs.createReadStream(dmatix.docLocation+'/'+allFiles[count]);
parse(html,allFiles[count]);

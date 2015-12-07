"use strict";

/**
 * A JSDOC plugin to provide various tag extensions
 *  
 * @module plugin
 * @chapter server
 * */

/**
 * Consumed by JSDOC to extend the tag dictionary definitions 
 * @param {object} dictionary - The JSDOC dictionary object to extend
 * **/
exports.defineTags = function(dictionary) {

	dictionary.defineTag('ngdoc', {
		mustHaveValue: true,
		onTagged : function(doclet, tag) {
			//console.log(doclet);
			if (tag.value == "method") {		
				doclet.addTag('kind', 'function');
			} else {		  
				doclet.addTag('kind', 'class');
			}
			doclet.ngdoc = tag.value;
			doclet.summary=doclet.description
		}
	});

	dictionary.defineTag('attribute', {
		mustHaveValue: true,
		canHaveType: true,
		canHaveName: true,
		onTagged: function(doclet, tag) {
			if (!doclet.attributes) { doclet.attributes = []; }
			doclet.attributes.push(tag.value);
		}
	})
	.synonym('attr');

	dictionary.defineTag('chapter', {
		mustHaveValue: true,
		onTagged: function(doclet, tag) {

			if(doclet.kind === 'module'){
				doclet.chapter=tag.text;
				doclet.name=tag.text+'/'+doclet.name;
			}
		}
	});
	dictionary.defineSynonym('module','project');
//console.log(dictionary)
};

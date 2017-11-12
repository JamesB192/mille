/* jqml - jQuery-free JsonML Utility
 * Author: Trevor Norris
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
(function(document, global) {
var SVGns="http://www.w3.org/2000/svg";
var XHTMLns="http://www.w3.org/1999/xhtml";
var toString = {}.toString,

	// set element attributes
	// check for IE specific functionality and set function accordingly
	setEleAttr = document.documentElement.style.setAttribute ? function(args, iTem) {
		// loop through and apply attributes
		for (var aKey in args) {
			// check if aKey is 'style' attribute
			if (aKey !== 'style') {
				iTem.setAttribute(aKey, args[aKey]);
			} else {
				// technique from http://www.kadimi.com/en/setattribute-getattribute-315
				iTem.style.setAttribute('cssText', args[aKey]);
			}
		}
		return iTem;
	} : function(args, iTem) {
		// loop through and apply attributes
		for (var aKey in args) {
				iTem.setAttribute(aKey, args[aKey]);
		}
		return iTem;
	},

	// check if string or number
	isStringy = function(arg) {
		return typeof arg === 'string' || typeof arg === 'number';
	},

	// check if array
	isArray = Array.isArray || function(arg) {
		return toString.call(arg) === '[object Array]';
	};

function jqmlns(NS, elems) {
	// create/set element
	var node = elems[0].nodeType ? elems[0] : document.createElementNS(NS,elems[0]),
		i = 1, j;
	// loop though passed arguments
	for (; i < elems.length; i++) {
		// check if argument is array
		if (isArray(elems[i])) {
			if (isArray(elems[i][0])) {
				for (j = 0; j < elems[i].length; j++) {
					node.appendChild(jqmlns(NS,elems[i][j]));
				}
			} else {
				node.appendChild(jqmlns(NS,elems[i]));
			}
		// check if string or number
		} else if (isStringy(elems[i])) {
			node.appendChild(document.createTextNode(elems[i]));
		// check if DOM element
		} else if (elems[i].nodeType) {
			node.appendChild(elems[i]);
		// set element attributes
		} else {
			setEleAttr(elems[i], node);
		}

	}
	return node;
};
function jqmlsvg(elems){return jqmlns(SVGns,elems)};
function jqml(elems){return jqmlns(XHTMLns,elems)};

// expose jqmlsvg
global.jqmlsvg = jqmlsvg;
global.jqmlns = jqmlns;
global.jqml = jqml;

}(document, this));

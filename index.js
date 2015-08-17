require('babel-core/register');
require('babel-core/polyfill');

//var Parser = require('./parser.js');
//
//var a = "1 + 2 + 3";
//var b = "1 - 2 + 3";
//var c = "1 + 2 - 3";
//var d = "1 - 2 - 3";
//
//console.log(Parser.parse(a));
//console.log(Parser.parse(b));
//console.log(Parser.parse(c));
//console.log(Parser.parse(d));
//
//console.log(Parser.parse("0.1 + 1.2 - .3"));
//
//console.log(Parser.render(Parser.parse(d)));
//console.log(Parser.renderHTML(Parser.parse(d)));

var LinkedList = require('./expression.js').LinkedList;



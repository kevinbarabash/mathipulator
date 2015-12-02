require('babel-core/register');
var Parser = require('./src/parser.js');

var parser = new Parser();

var expr = parser.parse('1+2(3-4)');

console.log(expr.toString());

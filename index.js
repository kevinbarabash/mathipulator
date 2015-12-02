require('babel-core/register');
var Parser = require('./src/parser.js');

var parser = new Parser();

var math = '2(x+2)=6';
console.log(math);
var expr = parser.parse(math);

console.log(expr.toString());

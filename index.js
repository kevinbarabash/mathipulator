require('babel-core/register');
require('babel-core/polyfill');

var Math = require('./src/expression.js');
var Expression = Math.Expression;
var Literal = Math.Literal;
var Product = Math.Product;
var Fraction = Math.Fraction;
var Identifier = Math.Identifier;
var Operator = Math.Operator;
var Equation = Math.Equation;

var Transforms = require('./src/transforms.js');
var distributeBackwards = Transforms.distributeBackwards;
var distributeForwards = Transforms.distributeForwards;


var expr = new Expression(new Literal(1));
expr.subtract(new Literal(2));
expr.add(new Literal(3));
console.log(expr.toString());
console.log("");

var four = new Literal(4);
expr = expr.multiply(four);
console.log(expr.toString());
expr = distributeBackwards(four);
console.log(expr.toString());
console.log("");

expr = expr.add(new Literal(25));
console.log(expr.toString());

var product = new Product(new Literal(4));
product.multiply(new Literal(5));
product.multiply(new Literal(-6));
console.log(product.toString());
console.log("");

expr = new Expression(new Literal(1));
expr.subtract(new Literal(2));
expr.add(new Literal(3));

four = new Literal(4);
expr = four.multiply(expr);
console.log(expr.toString());

expr = distributeForwards(four);
console.log(expr.toString());
console.log("");

var frac = new Fraction(new Literal(1), new Identifier('a'));
console.log(frac.toString());
console.log("");

var prod1 = new Product(new Literal(1), new Operator('*'), new Literal(2));
console.log(prod1.toString());
var prod2 = prod1.clone();
console.log(prod2.toString());
prod1.first.value = 4;
console.log(prod1.toString());
console.log(prod2.toString());
console.log("");

console.log("before new equation");
var eqn = new Equation(prod1, prod2);
console.log(eqn.toString());

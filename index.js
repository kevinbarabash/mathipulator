var Math = require('./src/expression.js');

let {
    Expression,
    Literal,
    Product,
    Fraction,
    Identifier,
    Operator,
    Equation
} = Math;

var Transforms = require('./src/transforms.js');
var distributeBackwards = Transforms.distributeBackwards;
var distributeForwards = Transforms.distributeForwards;


var expr1 = new Expression(new Literal(1));
expr1.subtract(new Literal(2));
expr1.add(new Literal(3));
console.log(expr1.toString());
for (let i of expr1) {
    console.log(i);
}
console.log("");

//var four = new Literal(4);
//expr = expr.multiply(four);
//console.log(expr.toString());
//expr = distributeBackwards(four);
//console.log(expr.toString());
//console.log("");
//
//expr = expr.add(new Literal(25));
//console.log(expr.toString());
//
//var product = new Product(new Literal(4));
//product.multiply(new Literal(5));
//product.multiply(new Literal(-6));
//console.log(product.toString());
//console.log("");
//
//expr = new Expression(new Literal(1));
//expr.subtract(new Literal(2));
//expr.add(new Literal(3));
//
//four = new Literal(4);
//expr = four.multiply(expr);
//console.log(expr.toString());
//
//expr = distributeForwards(four);
//console.log(expr.toString());
//console.log("");
//
//var frac = new Fraction(new Literal(1), new Identifier('a'));
//console.log(frac.toString());
//console.log("");
//
//var prod1 = new Product(new Literal(1), new Operator('*'), new Literal(2));
//console.log(prod1.toString());
//var prod2 = prod1.clone();
//console.log(prod2.toString());
//prod1.first.value = 4;
//console.log(prod1.toString());
//console.log(prod2.toString());
//console.log("");
//
//console.log("before new equation");
//var eqn = new Equation(prod1, prod2);
//console.log(eqn.toString());

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let pixelRatio = window.devicePixelRatio;

canvas.width = 1200 * pixelRatio;
canvas.height = 700 * pixelRatio;
canvas.style.width = 1200 + "px";
canvas.style.height = 700 + "px";
ctx.scale(pixelRatio, pixelRatio);

document.body.appendChild(canvas);

let fontSize = 64;
ctx.font = `100 ${fontSize}px sans-serif`;

let space = ctx.measureText(" ").width;
let paren = ctx.measureText("(").width;

function layout(node) {
    let x = 0, y = 0, height = 32;
    
    if (node.type === 'Literal') {
        let text = String(node.value).replace(/\-/g, "\u2212");
        let width = ctx.measureText(text).width;
        return {x, y, width, height, text};
    } else if (node.type === 'Operator') {
        let text = String(node.operator).replace(/\-/g, "\u2212");
        let width = ctx.measureText(text).width;
        return {x, y, width, height, text};
    } else if (node.type === 'Expression') {
        let width = 0;
        let children = [];
        for (let child of node) {
            let child_layout = layout(child);
            if (child.type === 'Operator') {
                x += space;
                width += space;
            }
            child_layout.x = x;
            child_layout.y = y;
            width += child_layout.width;
            x += child_layout.width;
            if (child.type === 'Operator') {
                x += space;
                width += space;
            }
            children.push(child_layout);
        }
        return {x:0, y:0, width, height, children};
    } else if (node.type === 'Product') {
        let width = 0;
        let children = [];
        for (let child of node) {
            if (child.type === 'Operator') {
                continue;
            }
            children.push({x, y, paren, height, text: '('});
            width += paren;
            x += paren;
            
            let child_layout = layout(child);
            child_layout.x = x;
            child_layout.y = y;
            width += child_layout.width;
            x += child_layout.width;
            children.push(child_layout);

            children.push({x, y, paren, height, text: ')'});
            width += paren;
            x += paren;
        }
        return {x:0, y:0, width, height, children};
    } else if (node.type === 'Equation') {
        let width = 0;
        let left = layout(node.left);
        console.log(`left.width = ${left.width}`);
        width += left.width + space;
        x += left.width + space;
        
        let equalsWidth = ctx.measureText("=").width;
        let equals = {x, y, width:equalsWidth, height, text: '='};
        
        width += equalsWidth + space;
        x += equalsWidth + space;
        
        let right = layout(node.right);
        
        width += right.width;
        right.x = x;

        let children = [left, equals, right];
        return {x:0, y:0, width, height, children};
    }
}

function render(layout) {
    if (layout.text) {
        let text = String(layout.text).replace(/\-/g, "\u2212");
        ctx.fillText(text, 0, 0);
    } else if (layout.children) {
        for (let child of layout.children) {
            ctx.save();
            console.log(child.x);
            ctx.translate(child.x, child.y);
            render(child);
            ctx.restore();
        }
    } else {
        throw "layout doesn't have text or children";
    }
}

ctx.fillStyle = 'black';
ctx.translate(100,100);

var expr2 = new Expression(new Literal(5));
expr2.add(new Literal(10));
expr2.subtract(new Literal(-2));

var prod = new Equation(expr1, expr2);

let l1 = layout(prod);
render(l1);


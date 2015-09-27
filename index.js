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

// TODO: layout objects should know about their parent as well

function layout(node, x, y) {
    console.log(`x = ${x}, y = ${y}`);
    let height = fontSize, owner = node.id;
    
    if (node.type === 'Literal') {
        let text = String(node.value).replace(/\-/g, "\u2212");
        let width = ctx.measureText(text).width;
        return {owner, x, y, width, height, text};
    } else if (node.type === 'Operator') {
        let text = String(node.operator).replace(/\-/g, "\u2212");
        let width = ctx.measureText(text).width;
        return {owner, x, y, width, height, text};
    } else if (node.type === 'Expression') {
        let width = 0;
        let children = [];
        for (let child of node) {
            let child_layout = layout(child, x, y);
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
        return {owner, x:0, y:0, width, height, children};
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
            
            let child_layout = layout(child, x, y);
            child_layout.x = x;
            child_layout.y = y;
            width += child_layout.width;
            x += child_layout.width;
            children.push(child_layout);

            children.push({x, y, paren, height, text: ')'});
            width += paren;
            x += paren;
        }
        return {owner, x:0, y:0, width, height, children};
    } else if (node.type === 'Equation') {
        let width = 0;
        let left = layout(node.left, x, y);
        width += left.width + space;
        x += left.width + space;
        
        let equalsWidth = ctx.measureText("=").width;
        let equals = {owner, x, y, width:equalsWidth, height, text: '='};
        
        width += equalsWidth + space;
        x += equalsWidth + space;
        
        let right = layout(node.right, x, y);
        
        width += right.width;
        right.x = x;

        let children = [left, equals, right];
        return {owner, x:0, y:0, width, height, children};
    }
}

function render(layout, owners, outline) {
    if (layout.text) {
        let text = String(layout.text).replace(/\-/g, "\u2212");
        if (layout.owner in owners) {
            ctx.fillText(text, layout.x, layout.y);
            if (outline) {
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(0, 0 - layout.height, layout.width, layout.height);
            }
        }
    } else if (layout.children) {
        if (outline) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(0, 0 - layout.height, layout.width, layout.height);
        }
        for (let child of layout.children) {
            render(child, ids, outline);
        }
    } else {
        throw "layout doesn't have text or children";
    }
}

function getAllOwners(layout, owners = []) {
    if (layout.owner !== undefined) {
        owners.push(layout.owner);
    }
    if (layout.children) {
        for (let child of layout.children) {
            getAllOwners(child, owners);
        }
    }
    return owners;
}

// hypothesis: if everything had an absolute position, it would be easier to
// tween and do compound movements like fade and move
// 
// question: how do we handle growing the selection in this case?

ctx.fillStyle = 'black';
ctx.strokeStyle = 'red';

var expr1 = new Expression(new Literal(1));
expr1.add(new Literal(3));

var expr2 = new Expression(new Literal(5));
expr2.subtract(new Literal(-2));

var eqn1 = new Equation(expr1, expr2);
let l1 = layout(eqn1, 0, 0);
eqn1.add(new Literal(1));
let l2 = layout(eqn1, 0, 0);

var ids = getAllOwners(l1);
console.log(ids);

ctx.translate(100,100);
render(l1, ids);

ctx.translate(0,100);
render(l2, ids);


let {
    Expression,
    Literal,
    Product,
    Fraction,
    Identifier,
    Operator,
    Equation
} = require('./src/ast.js');

const {getMetrics, createLayout, flatten} = require("./src/layout.js");

let { add, sub, removeExtraParens } = require('./src/operations.js');

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.strokeStyle = 'red';

let pixelRatio = window.devicePixelRatio;

canvas.width = 1200 * pixelRatio;
canvas.height = 700 * pixelRatio;
canvas.style.width = 1200 + "px";
canvas.style.height = 700 + "px";
ctx.scale(pixelRatio, pixelRatio);

document.body.appendChild(canvas);

let expr1, expr2, eqn1;

expr1 = add(new Literal(25), new Product(new Literal(42), new Identifier('pi'), new Identifier('r')));
expr1 = add(expr1, new Identifier('theta'));
expr2 = sub(new Fraction(new Identifier('y'), add(new Literal(5), new Identifier('x'))), new Literal(-2));

eqn1 = new Equation(expr1, expr2);

let newLayout = createLayout(eqn1, 72);
let flattenedLayout = flatten(newLayout);

ctx.save();
ctx.translate(100,200);

flattenedLayout.render(ctx);

ctx.restore();

function findNode(node, id) {
    if (node.id === id) {
        return node;
    } else if (["Expression", "Product"].includes(node.type)) {
        for (const child of node) {
            const result = findNode(child, id);
            if (result) {
                return result;
            }
        }
    } else if (node.type === "Equation") {
        const lhs = findNode(node.left, id);
        if (lhs) return lhs;
        const rhs = findNode(node.right, id);
        if (rhs) return rhs;
    } else if (node.type === "Fraction") {
        const num = findNode(node.numerator, id);
        if (num) return num;
        const den = findNode(node.denominator, id);
        if (den) return den;
    }
}

document.addEventListener('click', function(e) {
    var x = e.pageX - 100;
    var y = e.pageY - 200;

    const layoutNode = flattenedLayout.hitTest(x, y);
    if (layoutNode) {
        const {id} = layoutNode;
        const selectedNode = findNode(eqn1, id);
        console.log(selectedNode);
    }
});

let {
    Expression,
    Literal,
    Product,
    Fraction,
    Identifier,
    Operator,
    Equation
} = require('./src/ast.js');

const {
    getMetrics,
    createLayout,
    flatten,
    RenderOptions
} = require("./src/layout.js");

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

function findEqual(flatLayout) {
    for (const child of flatLayout.children) {
        if (child.text === "=") {
            return child;
        }
    }
}

const equalNode = findEqual(flattenedLayout);
const bounds = equalNode.bounds;
const equalX = (bounds.left + bounds.right) / 2;
const equalY = (bounds.top + bounds.bottom) / 2;

console.log(`(${equalX}, ${equalY})`);

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const dx = centerX - equalX;
const dy = centerY - equalY;

function translateLayout(flatLayout, dx, dy) {
    for (const child of flatLayout.children) {
        child.x += dx;
        child.y += dy;
    }
}

translateLayout(flattenedLayout, dx, dy);

function drawAxes(ctx) {
    let width = canvas.width;
    let height = canvas.height;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

let selection = null;
RenderOptions.bounds = false;
RenderOptions.axes = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (RenderOptions.axes) {
        drawAxes(ctx);
    }

    if (selection) {
        ctx.fillStyle = 'rgba(255,255,0,0.25)';
        console.log(selection);

        if (selection.metrics) {
            const width = selection.metrics.width;
            const height = selection.metrics.height;
            const x = selection.x + selection.metrics.bearingX;
            const y = selection.y - selection.metrics.bearingY - height;

            ctx.fillRect(x, y, width, height);
        } else {
            const bounds = selection.bounds;

            const width = bounds.right - bounds.left;
            const height = bounds.bottom - bounds.top;
            const x = selection.x + bounds.left;
            const y = selection.y + bounds.top;

            ctx.fillRect(x, y, width, height);
        }
    }

    ctx.fillStyle = 'black';
    flattenedLayout.render(ctx);
}

draw();

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
    var x = e.pageX;
    var y = e.pageY;

    const layoutNode = flattenedLayout.hitTest(x, y);
    if (layoutNode) {
        const {id} = layoutNode;
        const selectedNode = findNode(eqn1, id);
        console.log(selectedNode);
        selection = layoutNode;
    } else {
        selection = null;
    }
    draw();
});

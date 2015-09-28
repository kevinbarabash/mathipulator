let {
    Expression,
    Literal,
    Product,
    Fraction,
    Identifier,
    Operator,
    Equation
    } = require('./src/expression.js');

let {
    layout,
    render,
    lerpLayout,
    ctx
    } = require('./src/renderer.js');


var expr1 = new Expression(new Literal(1));
expr1.add(new Literal(3));

var expr2 = new Expression(new Literal(5));
expr2.subtract(new Literal(-2));

var eqn1 = new Equation(expr1, expr2);
let l1 = layout(eqn1);

var ids = Object.keys(l1);

eqn1.add(new Literal(25));
let l2 = layout(eqn1);

console.log(l1);
console.log(l2);

let equalsWidth = ctx.measureText("=").width;

var t = 0;

// TODO: figure out a better way to handle a series of animations

function easeQuadratic(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function easeInCubic(t) {
    return t * t * t;
}

function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

function findEquals(layout) {
    let result = null;
    Object.keys(layout).forEach(id => {
        let leaf = layout[id];
        if (leaf.text === '=') {
            result = leaf;
        }
    });
    return result;
}

function drawAxes(ctx) {
    let width = 1200;
    let height = 700;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

function draw1() {
    ctx.clearRect(0, 0, 1200, 700);
    drawAxes(ctx);

    let l3 = lerpLayout(l1, l2, ids, easeCubic(t));
    let equals = findEquals(l3);

    ctx.save();
    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
    render(l3, ids);
    ctx.restore();

    if (t < 1) {
        t += 0.03;
        requestAnimationFrame(draw1);
    } else {
        t = 0;
        requestAnimationFrame(draw2);
    }
}

function draw2() {
    ctx.clearRect(0, 0, 1200, 700);
    drawAxes(ctx);

    let equals = findEquals(l2);

    ctx.save();
    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
    render(l2, ids, easeOutCubic(t));
    ctx.restore();

    if (t < 1) {
        t += 0.03;
        requestAnimationFrame(draw2);
    } else {

    }
}

draw1();



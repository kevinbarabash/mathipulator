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
        return {x:0, y:0, width, height, children};
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
        return {x:0, y:0, width, height, children};
    }
}

function render(layout, owners, outline) {
    Object.keys(layout).forEach(owner => {
        let leaf = layout[owner];
        let text = String(leaf.text).replace(/\-/g, "\u2212");
        if (owners.indexOf(leaf.owner.toString()) !== -1) {
            ctx.fillText(text, leaf.x, leaf.y);
            if (outline) {
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(0, 0 - leaf.height, leaf.width, leaf.height);
            }
        }
    });
}

function getOwners(layout) {
    return Object.keys(layout);
}

function flattenLayout(layout, leaves = {}) {
    if (layout.children) {
        for (let child of layout.children) {
            flattenLayout(child, leaves);
        }
    } else {
        leaves[layout.owner] = layout;
    }
    return leaves;
}

function lerp(val1, val2, t) {
    return (1 - t) * val1 + t * val2;
}

/**
 * 
 * @param {Object} layout1
 * @param {Object} layout2
 * @param {Array} owners
 * @param {Number} t A number between 0 and 1
 */
function lerpLayout(layout1, layout2, owners, t) {
    let layout = {};
    owners.forEach(owner => {
        let l1 = layout1[owner];
        let l2 = layout2[owner];
        
        layout[owner] = {
            owner:owner,
            x: lerp(l1.x, l2.x, t),
            y: 0,
            width: l1.owner,
            height: l1.owner,
            text: l1.text
        };
    });
    return layout;
}

ctx.fillStyle = 'black';
ctx.strokeStyle = 'red';

var expr1 = new Expression(new Literal(1));
expr1.add(new Literal(3));

var expr2 = new Expression(new Literal(5));
expr2.subtract(new Literal(-2));

var eqn1 = new Equation(expr1, expr2);
let l1 = flattenLayout(layout(eqn1, 0, 0));

var owners = getOwners(l1);
console.log(owners);

eqn1.add(new Literal(1));
let l2 = flattenLayout(layout(eqn1, 0, 0));

var t = 0;

function draw() {
    ctx.clearRect(0, 0, 1200, 700);
    ctx.save();

    let l3 = lerpLayout(l1, l2, owners, t);
    ctx.translate(100, 100);
    render(l3, owners);
    ctx.restore();
    
    if (t < 1) {
        t += 0.03;
        requestAnimationFrame(draw);
    } else {
        t = 1.0;
    }
}

draw();



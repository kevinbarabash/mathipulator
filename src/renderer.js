/**
 * Functions for creating and rendering math layouts
 */

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

let fontSize = 64;
ctx.font = `100 ${fontSize}px sans-serif`;

let space = ctx.measureText(" ").width;
let paren = ctx.measureText("(").width;

// TODO: layout objects should know about their parent as well

/**
 * Creates a layout
 *
 * @param {Object} node A Math AST node.
 * @param {Object} result The object to store the layout in.
 * @param {Object?} p A point specifying where to render the layout.
 * @returns {Object} The layout object.
 */
// TODO: use objects that have handy methods for getting bounds
// TODO: use a two pass process, 1st pass is nested layout, 2nd pass flattens everything
function layout(node, result = {}, p = { x: 0, y: 0 }) {
    let height = fontSize, id = node.id;

    if (node.type === 'Literal') {
        console.log(node.toString());
        let text = String(node.value).replace(/\-/g, "\u2212");
        if (parseFloat(node.value) < 0) {
            text = `(${text})`;
        }
        let width = ctx.measureText(text).width;
        result[id] = {id, height, width, text, ...p};
        p.x += width;
    } else if (node.type === 'Operator') {
        let text = String(node.operator).replace(/\-/g, "\u2212");
        let width = ctx.measureText(text).width;
        result[id] = {id, width, height, text, ...p};
        p.x += width;
    } else if (node.type === 'Expression') {
        for (let child of node) {
            console.log(child.toString());
            console.log(child);
            if (child.type === 'Operator') {
                p.x += space;
            }
            if (child.type === 'Expression') {
                let key = `${id}:leftParen`;
                result[key] = {id: key, width: paren, height, text: '(', ...p};
                p.x += paren;
            }
            layout(child, result, p);
            if (child.type === 'Expression') {
                let key = `${id}:rightParen`;
                result[key] = {id: key, width: paren, height, text: ')', ...p};
                p.x += paren;
            }
            if (child.type === 'Operator') {
                p.x += space;
            }
        }
    } else if (node.type === 'Product') {
        for (let child of node) {
            // TODO: option to use cdot for multiplication instead
            if (child.type === 'Operator') {
                continue;
            }
            let key = `${id}:leftParen`;
            result[key] = {id: key, width: paren, height, text: '(', ...p};
            p.x += paren;
            layout(child, result, p);
            key = `${id}:rightParen`;
            result[key] = {id: key, width: paren, height, text: ')', ...p};
            p.x += paren;
        }
    } else if (node.type === 'Equation') {
        layout(node.left, result, p);
        p.x += space;

        let width = ctx.measureText("=").width;
        result[id] = {id, width, height, text: '=', ...p};

        p.x += width + space;

        layout(node.right, result, p);
    } else if (node.type === 'Fraction') {
        let leftLayout = layout(node.left);
        let rightLayout = layout(node.right);

        let left = Infinity;
        let right = -Infinity;
        Object.values(leftLayout).forEach(value => {
            left = Math.min(left, value.x);
            right = Math.max(right, value.x + value.width);
        });
    }
    return result;
}

/**
 * Render a layout.
 *
 * @param {Object} layout The layout to render.
 * @param {Array} ids An array of ids specifying which parts of the expression
 *        to render.
 * @param {Number} t A number between 0 and 1, used for fading in new parts
 *        of the expression.
 */
function render(layout, ids, t) {
    Object.keys(layout).forEach(id => {
        let leaf = layout[id];
        let text = String(leaf.text).replace(/\-/g, "\u2212");
        if (!ids) {
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(text, leaf.x, leaf.y);
        } else if (ids.indexOf(leaf.id.toString()) !== -1) {
            // always visible
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(text, leaf.x, leaf.y);
        } else {
            // fade in
            var gray = (1 - t) * 255 | 0;
            ctx.fillStyle = `rgb(${gray},${gray},255)`;
            ctx.fillText(text, leaf.x, leaf.y);
        }
    });
}

/**
 * Interpolates between two values.
 *
 * @param val1
 * @param val2
 * @param t
 * @returns {number}
 */
function lerp(val1, val2, t) {
    return (1 - t) * val1 + t * val2;
}

/**
 * Interpolates between two layouts.
 *
 * @param {Object} layout1
 * @param {Object} layout2
 * @param {Array} ids
 * @param {Number} t A number between 0 and 1
 */
function lerpLayout(layout1, layout2, ids, t) {
    let layout = {};
    ids.forEach(id => {
        let l1 = layout1[id];
        let l2 = layout2[id];

        layout[id] = {
            id: id,
            x: lerp(l1.x, l2.x, t),
            y: 0,
            width: lerp(l1.width, l2.width, t),
            height: lerp(l1.height, l2.height, 2),
            text: l1.text
        };
    });

    return layout;
}

function hitTest(layout, x, y) {
    let result = null;
    Object.keys(layout).forEach(id => {
        let leaf = layout[id];
        if (x > leaf.x && x < leaf.x + leaf.width && y > leaf.y - leaf.height && y < leaf.y) {
            console.log(leaf);
            result = leaf;
        }
    });
    return result;
}

module.exports = {
    layout,
    render,
    lerpLayout,
    ctx,
    hitTest
};

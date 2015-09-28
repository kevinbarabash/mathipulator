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
function layout(node, result = {}, p = { x: 0, y: 0 }) {
    let height = fontSize, id = node.id;

    if (node.type === 'Literal') {
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
            if (child.type === 'Operator') {
                p.x += space;
            }
            layout(child, result, p);
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
            result[id] = {id: `${id}:leftParen`, width: paren, height, text: '(', ...p};
            p.x += paren;
            layout(child, result, p);
            result[id] = {id: `${id}:rightParen`, width: paren, height, text: ')', ...p};
            p.x += paren;
        }
    } else if (node.type === 'Equation') {
        layout(node.left, result, p);
        p.x += space;

        let width = ctx.measureText("=").width;
        result[id] = {id, width, height, text: '=', ...p};

        p.x += width + space;

        layout(node.right, result, p);
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
        if (ids.indexOf(leaf.id.toString()) !== -1) {
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(text, leaf.x, leaf.y);
        } else {
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
            text: l1.text
        };
    });
    
    return layout;
}

module.exports = {
    layout,
    render,
    lerpLayout,
    ctx
};

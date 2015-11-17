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

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

module.exports = {
    lerp, lerpLayout, easeQuadratic, easeCubic, easeInCubic, easeOutCubic
};

const { Literal } = require('../ast.js');
const { deepEqual } = require('../util/node_utils.js');

function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    if (node.type === 'Operator' && node.operator === '-') {
        return deepEqual(node.prev, node.next);
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        const { parent, prev, next } = node;
        parent.remove(prev);
        parent.remove(next);
        parent.replace(node, new Literal(0));
    }
}

module.exports = {
    label: 'cancel',
    canTransform,
    doTransform
};

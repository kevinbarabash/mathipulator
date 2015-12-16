const { Literal } = require('../ast.js');
const { deepEqual } = require('../util/node_utils.js');

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '-') {
        return deepEqual(node.prev, node.next);
    }
    return false;
}

function doTransform(node) {
    if (canTransform(node)) {
        const { parent, prev, next } = node;
        parent.remove(prev);
        parent.remove(next);
        parent.replace(node, new Literal(0));
    }
}

module.exports = {
    label: 'cancel subtraction',
    canTransform,
    doTransform
};

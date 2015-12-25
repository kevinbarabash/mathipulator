const { Literal, Operator } = require('../ast.js');

function canTransform(node) {
    if (node.type === 'Literal' && node.value === 1) {
        if (node.next && node.prev) {
            return node.next.operator === '*' && node.prev.operator === '*';
        } else if (node.next) {
            return node.next.operator === '*';
        } else if (node.prev) {
            return node.prev.operator === '*';
        } else {
            return false;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        const { parent, next, prev } = node;

        if (next) {
            parent.remove(next);
        }

        if (prev) {
            parent.remove(prev);
        }

        if (next && prev) {
            parent.replace(node, new Operator('*'));
        } else {
            parent.remove(node);
        }
    }
}

module.exports = {
    label: 'eliminate',
    canTransform,
    doTransform,
};

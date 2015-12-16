const { Literal } = require('../ast.js');

function canTransform(node) {
    if (node.type === 'Literal' && node.value === 0) {
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
        node.parent.parent.replace(node.parent, new Literal(0));
    }
}

module.exports = {
    label: 'simplify to zero',
    canTransform,
    doTransform,
};

const { Literal } = require('../ast.js');

function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
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

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        node.parent.parent.replace(node.parent, new Literal(0));
    }
}

module.exports = {
    label: 'simplify to zero',
    canTransform,
    doTransform,
};

const { Negation, Literal } = require('../ast.js');

function canTransform(selection) {
    // TODO: handle a * -1 * b -> a * -b
    // TODO: handle b * -1 -> -b
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    if (node.type === 'Product' && node.length === 3) {
        return node.first.type === 'Literal' && node.first.value === -1;
    }
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        if (node.last.type === 'Literal' && node.last.value > 0) {
            node.parent.replace(node, new Literal(-node.last.value));
        } else {
            const replacement = new Negation(node.last.clone());
            node.parent.replace(node, replacement);
        }
    }
}

module.exports = {
    label: 'rewrite as negation',
    canTransform,
    doTransform
};

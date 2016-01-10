const { Literal } = require('../ast.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length >= 3) {
        for (const node of selection) {
            if (node.type === 'Literal' && node.value === 0) {
                return true;
            }
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const [first, ...rest] = selection;
        const parent = first.parent;
        rest.forEach(node => parent.remove(node));

        const replacement = new Literal(0);
        parent.replace(first, replacement);

        // collapse if there is only one node in the expression
        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }
    }
}

module.exports = {
    label: 'simplify to zero',
    canTransform,
    doTransform,
};

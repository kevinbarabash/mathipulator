const { add, div } = require('../operations.js');
const { deepEqual } = require('../util/node_utils.js');

function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    if (node.type === 'Operator' && node.operator === '+') {
        const { prev, next } = node;
        return prev.type === 'Fraction' && next.type === 'Fraction' &&
            deepEqual(prev.denominator, next.denominator);
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        const { parent, prev, next } = node;

        const replacement = div(
            add(prev.numerator.clone(), next.numerator.clone()),
            prev.denominator.clone()
        );

        parent.remove(prev);
        parent.remove(next);
        parent.replace(node, replacement);

        // collapse if there is only one node in the expression
        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }
    }
}

module.exports = {
    label: 'add fractions',
    canTransform,
    doTransform
};

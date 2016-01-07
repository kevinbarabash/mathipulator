const { mul, div } = require('../operations.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3) {
        const [first, operator, last] = selection;
        if (first.type === 'Fraction' && last.type === 'Fraction' && operator.type === 'Operator') {
            return selection.first.next.operator === '*';
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const [prev, node, next] = selection;
        const parent = node.parent;

        const replacement = div(
            mul(prev.numerator.clone(), next.numerator.clone()),
            mul(prev.denominator.clone(), next.denominator.clone())
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
    label: 'multiply fractions',
    canTransform,
    doTransform
};

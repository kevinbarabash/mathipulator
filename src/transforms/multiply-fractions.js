const { mul, div } = require('../operations.js');

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '*') {
        const { prev, next } = node;
        return prev.type === 'Fraction' && next.type === 'Fraction';
    }
    return false;
}

function doTransform(node) {
    if (canTransform(node)) {
        const { parent, prev, next } = node;

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

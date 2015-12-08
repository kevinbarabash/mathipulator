const Literal = require('../ast/literal.js');
const { mul, div, removeExtraProductParens } = require('../operations.js');

function canTransform(node) {
    return node.type === 'Fraction';
}

function doTransform(node) {
    if (canTransform(node)) {
        const parent = node.parent;

        parent.replace(
            node,
            mul(
                node.numerator.clone(),
                div(new Literal(1), node.denominator.clone())
            )
        );

        if (parent.type === 'Product') {
            removeExtraProductParens(parent);
        }
    }
}

module.exports = {
    label: 'rewrite division',
    canTransform,
    doTransform
};

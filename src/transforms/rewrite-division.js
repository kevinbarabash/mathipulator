const Literal = require('../ast/literal.js');
const { mul, div, removeExtraProductParens } = require('../operations.js');

function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    return node.type === 'Fraction';
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
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

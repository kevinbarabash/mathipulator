const { div } = require('../operations.js');

function canTransform(selection) {
    if (selection.length === 1 && selection.first.type === 'Fraction') {
        const numerator = selection.first.numerator;

        return numerator.type === 'Expression';
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const { numerator, denominator } = selection.first;
        const expression = numerator.clone();
        for (const node of expression) {
            if (node.type !== 'Operator') {
                expression.replace(node, div(node.clone(), denominator.clone(true)));
            }
        }
        selection.first.parent.replace(selection.first, expression);
    }
}

module.exports = {
    label: 'split fraction',
    canTransform,
    doTransform,
};

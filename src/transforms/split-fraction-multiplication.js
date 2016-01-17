const f = require('functify');

const { div } = require('../operations.js');
const { Operator, Product } = require('../ast.js');

function canTransform(selection) {
    if (selection.length === 1 && selection.first.type === 'Fraction') {
        const { numerator, denominator } = selection.first;

        if (numerator.type === 'Product' && denominator.type === 'Product') {
            return numerator.length > 1 && numerator.length === denominator.length;
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const { numerator, denominator } = selection.first;

        const product = new Product();
        for (const [num, den] of f.zip(numerator, denominator)) {
            if (num.type === 'Operator' && den.type === 'Operator') {
                product.append(new Operator('*'));
            } else if (num.type !== 'Operator' && den.type !== 'Operator') {
                product.append(div(num.clone(), den.clone()));
            } else {
                // this should never happen
            }
        }

        selection.first.parent.replace(selection.first, product);
    }
}

module.exports = {
    label: 'split fraction',
    canTransform,
    doTransform,
};

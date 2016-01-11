const f = require('functify');

const { Literal, Operator, Product } = require('../ast.js');
const { mul } = require('../operations.js');
const { compare } = require('../util/node_utils.js');

const nodeIs = type => node => node.type === type;
const nodeIsNot = type => node => node.type !== type;

const getFactors = function(node) {
    if (node.type === 'Product') {
        const factors = f(node).filter(nodeIsNot('Operator'));
        if (factors.every(nodeIsNot('Literal'))) {
            return [new Literal(1), ...factors];
        } else {
            return [...factors];
        }
    } else if (node.type === 'Identifier') {
        return [new Literal(1), node];
    } else {
        return [node];
    }
};

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3) {
        const [a, , b] = selection;

        const aFactors = getFactors(a);
        const bFactors = getFactors(b);

        // make sure that we have a numeric coefficient
        if ([aFactors[0], bFactors[0]].every(nodeIs('Literal'))) {
            // create products from all non-numeric factors
            // we clone the factors when creating these new products because we
            // don't want to affect the AST at this point
            const aProduct = aFactors
                .filter(nodeIsNot('Literal'))
                .reduce((product, factor) => mul(product, factor.clone()), new Literal(1));
            const bProduct = bFactors
                .filter(nodeIsNot('Literal'))
                .reduce((product, factor) => mul(product, factor.clone()), new Literal(1));

            // verify that they match
            // we don't use deepEqual here because we want to allow x*y and y*x
            // to be considered the same
            return compare(aProduct, bProduct);
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const [a, operator, b] = selection;
        const parent = operator.parent;

        const aFactors = getFactors(a);
        const bFactors = getFactors(b);

        const coeff = new Literal(0);

        aFactors.filter(nodeIs('Literal')).forEach(factor => coeff.value += factor.value);
        bFactors.filter(nodeIs('Literal')).forEach(factor => coeff.value += factor.value);

        const replacement = aFactors.filter(nodeIsNot('Literal')).reduce((product, factor) => mul(product, factor), coeff);

        parent.remove(a);
        parent.remove(b);
        parent.replace(operator, replacement);

        // collapse if there is only one node in the expression
        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }
    }
}

// test cases
// x + x
// 2x + x
// x + 2x
// 2x + 2x
// xy + xy
// 2xy + xy
// xy + 2xy
// 2xy + 2xy
// also test subtraction

module.exports = {
    label: 'collect like terms',
    canTransform,
    doTransform
};

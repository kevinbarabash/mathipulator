const { Literal } = require('../ast.js');
const { mul } = require('../operations.js');
const { compare } = require('../util/node_utils.js');

function canTransform(node) {
    if (node.type === 'Operator' && ['+','-'].includes(node.operator) &&
            node.prev && (node.prev.type === 'Product' || node.prev.type === 'Identifier') &&
            node.next && (node.next.type === 'Product' || node.prev.type === 'Identifier')) {

        const prev = node.prev.clone();
        const next = node.next.clone();

        if (prev.type === 'Product' && prev.first.type === 'Literal') {
            prev.remove(prev.first);
            prev.remove(prev.first);
        }

        if (next.type === 'Product' && next.first.type === 'Literal') {
            next.remove(next.first);
            next.remove(next.first);
        }

        return compare(prev, next);
    }
    return false;
}

function doTransform(node) {
    if (canTransform(node)) {
        const parent = node.parent;
        const prev = node.prev.clone(true);
        const next = node.next.clone();

        let coeff = 0;

        if (prev.type === 'Identifier') {
            coeff += 1;
        } else if (prev.type === 'Product') {
            if (prev.first.type === 'Literal') {
                coeff += prev.first.value;
            } else {
                coeff += 1;
            }
        } else {
            // should never happen
        }

        const sign = node.operator === '+' ? 1 : -1;
        if (next.type === 'Identifier') {
            coeff += sign;
        } else if (next.type === 'Product') {
            if (next.first.type === 'Literal') {
                coeff += sign * next.first.value;
            } else {
                coeff += sign;
            }
        } else {
            // should never happen
        }

        if (prev.type === 'Product' && prev.first.type === 'Literal') {
            prev.remove(prev.first);
            prev.remove(prev.first);
        }

        const replacement = mul(new Literal(coeff), prev);

        parent.remove(node.prev);
        parent.remove(node.next);
        parent.replace(node, replacement);
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

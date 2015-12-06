const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');
const Negation = require('../ast/negation.js');
const Product = require('../ast/product.js');

function canTransform(node) {
    return node.type === 'Negation' ||
        node.type === 'Literal' && node.value < 0;
}

function doTransform(node) {
    if (canTransform(node)) {
        const parent = node.parent;
        if (parent.type === 'Product') {
            parent.insertBefore(new Literal(-1), node);
            parent.insertBefore(new Operator('*'), node);
            if (node.type === 'Negation') {
                parent.replace(node, node.value);
            } else if (node.type === 'Literal') {
                parent.replace(node, new Literal(-node.value));
            }
        } else if (parent.type === 'Expression') {
            if (node.type === 'Negation') {
                parent.replace(node, new Product(new Literal(-1), new Operator('*'), node.value));
            } else if (node.type === 'Literal') {
                parent.replace(node, new Product(new Literal(-1), new Operator('*'), new Literal(-node.value)));
            }
        } else if (parent.type === 'Fraction') {
            if (node.type === 'Negation') {
                parent.replace(node, new Product(new Literal(-1), new Operator('*'), node.value));
            } else if (node.type === 'Literal') {
                parent.replace(node, new Product(new Literal(-1), new Operator('*'), new Literal(-node.value)));
            }
        } else {
            throw new Error(`rewrite-negation failed with parent of type ${parent.type}`);
        }
    }
}

module.exports = {
    label: 'rewrite negation',
    canTransform,
    doTransform
};

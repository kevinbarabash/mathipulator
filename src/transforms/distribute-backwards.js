const Literal = require('../ast/literal.js');
const { mul } = require('../operations.js');

function canTransform(node) {
    return node.parent && node.parent.type === 'Product' &&
        node.prev && node.prev.operator === '*' &&
        node.prev.prev && node.prev.prev.type === 'Expression';
}

function doTransform(node) {
    if (canTransform(node)) {
        const expr = node.prev.prev;
        const terms = [];
        for (const child of expr) {
            if (child.type !== 'Operator') {
                terms.push(child);
            }
        }
        for (const term of terms) {
            const prod = mul(term.clone(), node.clone(true));
            expr.replace(term, prod);
        }
        const parent = node.parent;

        parent.parent.replace(parent, expr);
    }
}

module.exports = {
    label: 'distribute backwards',
    canTransform,
    doTransform
};

const Literal = require('../ast/literal.js');
const { mul, removeExtraParens } = require('../operations.js');

function canTransform(node) {
    return node.parent && node.parent.type === 'Product' &&
        node.next && node.next.operator === '*' &&
        node.next.next && node.next.next.type === 'Expression';
}

function doTransform(node) {
    if (canTransform(node)) {
        const expr = node.next.next;
        const terms = [];
        for (const child of expr) {
            if (child.type !== 'Operator') {
                terms.push(child);
            }
        }
        for (const term of terms) {
            // TODO: give clone() an option that gives all nodes new ids
            const prod = mul(new Literal(node.value), term.clone());
            expr.replace(term, prod);
        }
        const parent = node.parent;

        parent.parent.replace(parent, expr);

        if (parent.parent && parent.parent.type === 'Expression') {
            removeExtraParens(parent.parent);
        }
    }
}

module.exports = {
    label: 'distribute forwards',
    canTransform,
    doTransform
};

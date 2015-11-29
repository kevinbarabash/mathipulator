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
            // TODO: give clone() an option that gives all nodes new ids
            const prod = mul(term.clone(), new Literal(node.value));
            expr.replace(term, prod);
        }
        const parent = node.parent;

        // remove unnecessary parentheses
        // TODO: check if there's an addition sign infront if parent.prev isn't null
        // TODO: think about having this be an explicit step
        if (parent.prev == null && parent.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, expr);
            }
        }
    }
}

module.exports = {
    label: 'distribute backwards',
    canTransform,
    doTransform
};

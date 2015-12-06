const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '+') {
        if (node.next && node.next.type === 'Literal' && node.next.value < 0) {
            return true;
        } else if (node.next && node.next.type === 'Negation') {
            return true;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        const next = node.next;
        const parent = node.parent;

        if (next.type === 'Literal' && next.value < 0) {
            parent.replace(next, new Literal(-next.value));
        } else if (next.type === 'Negation') {
            parent.replace(next, next.value);
        }

        parent.replace(node, new Operator('-'));
    }
}

module.exports = {
    label: 'rewrite addition',
    canTransform,
    doTransform
};

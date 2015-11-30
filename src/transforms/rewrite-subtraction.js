const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');
const Negation = require('../ast/negation.js');

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '-') {
        return true;
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        const next = node.next;
        const parent = node.parent;

        if (next.type === 'Literal' && next.value > 0) {
            parent.replace(next, new Literal(-next.value));
        } else {
            parent.replace(next, new Negation(next));
        }

        parent.replace(node, new Operator('+'));
    }
}

module.exports = {
    label: 'rewrite subtraction',
    canTransform,
    doTransform
};

const Negation = require('../ast/negation.js');

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '-') {
        return true;
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        // TODO: create new nodes and replace the existing nodes
        node.operator = '+';

        if (node.next.type === 'Literal') {
            node.next.value = -node.next.value;
        } else {
            node.parent.replace(node.next, new Negation(node.next));
        }
    }
}

module.exports = {
    label: 'rewrite subtraction',
    canTransform,
    doTransform
};

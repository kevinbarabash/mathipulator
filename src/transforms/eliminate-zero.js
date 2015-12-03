const { Literal, Negation } = require('../ast.js');

function canTransform(node) {
    if (node.type === 'Literal' && node.value === 0) {
        if (node.next && node.prev) {
            return ['+','-'].includes(node.prev.operator) && ['+','-'].includes(node.next.operator);
        } else if (node.next) {
            return ['+','-'].includes(node.next.operator);
        } else if (node.prev) {
            return ['+','-'].includes(node.prev.operator);
        } else {
            return false;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        const parent = node.parent;

        if (node.next && node.prev) {
            parent.remove(node.prev);
            parent.remove(node);
        } else if (node.next) {
            const operator = node.next.operator;
            const nextNext = node.next.next;
            parent.remove(node.next);
            parent.remove(node);

            if (operator === '-') {
                if (nextNext.type === 'Literal') {
                    parent.replace(nextNext, new Literal(-nextNext.value));
                } else {
                    parent.replace(nextNext, new Negation(nextNext));
                }
            }
        } else if (node.prev) {
            parent.remove(node.prev);
            parent.remove(node);
        }
    }
}

module.exports = {
    label: 'eliminate zero',
    canTransform,
    doTransform
};

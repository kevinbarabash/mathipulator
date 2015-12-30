const Literal = require("../ast/literal.js");

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

function canTransform(selection) {
    if (selection.type === 'single') {
        return false;
    }
    if (selection.length === 3 &&
        selection.first.type === 'Literal' && selection.last.type == 'Literal' &&
        selection.first.next.type === 'Operator') {

        if (selection.first.prev && selection.first.prev.operator === '-') {
            return false;
        }
        return true;
    }
    return false;
}

function doTransform(selection, newMath) {
    if (canTransform(selection)) {
        const node = selection.first.next;
        const { prev, next } = node;
        const parent = node.parent;

        const replacement = newMath || new Literal(
                operations[node.operator](prev.value, next.value)
            );

        parent.remove(prev);
        parent.remove(next);
        parent.replace(node, replacement);

        // collapse if there is only one node in the expression
        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }
    }
}

module.exports = {
    label: 'evaluate',
    canTransform,
    doTransform,
    needsUserInput: false,
};

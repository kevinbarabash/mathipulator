const Literal = require("../ast/literal.js");

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

function canTransform(node) {
    const { prev, next } = node;
    if (prev && next) {
        if (prev.type === "Literal" && next.type === "Literal") {
            if (prev.prev && prev.prev.operator === '-') {
                return false;
            }
            return true;
        }
    }
    return false;
}

function doTransform(node) {
    if (canTransform(node)) {
        const { prev, next } = node;

        const left = prev.value;
        const right = next.value;
        const result = operations[node.operator](left, right);
        const parent = node.parent;

        const replacement = new Literal(result);

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
    doTransform
};

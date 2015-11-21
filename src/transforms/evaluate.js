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
        return prev.type === "Literal" && next.type === "Literal";
    }
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

        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }

        // TODO: check if the product only has a single factor, collapse if it does
    }
}

module.exports = {
    canTransform,
    doTransform
};

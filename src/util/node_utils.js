const f = require('functify');

function findNode(node, id) {
    if (node.id === id) {
        return node;
    } else if (["Expression", "Product"].includes(node.type)) {
        for (const child of node) {
            const result = findNode(child, id);
            if (result) {
                return result;
            }
        }
    } else if (node.type === "Equation") {
        const lhs = findNode(node.left, id);
        if (lhs) return lhs;
        const rhs = findNode(node.right, id);
        if (rhs) return rhs;
    } else if (node.type === "Fraction") {
        const num = findNode(node.numerator, id);
        if (num) return num;
        const den = findNode(node.denominator, id);
        if (den) return den;
    } else if (node.type === "Negation") {
        const num = findNode(node.value, id);
        if (num) return num;
    }
}

var deepEqual = function(node1, node2) {
    if (node1.type !== node2.type) {
        return false;
    }

    const type = node1.type;

    if (type === 'Expression' || type === 'Product') {
        for (const [child1, child2] of f.zip([node1, node2])) {
            if (!deepEqual(child1, child2)) {
                return false;
            }
        }
        return true;
    } else if (type === 'Equation') {
        return deepEqual(node1.left, node2.left) &&
            deepEqual(node1.right, node2.right);
    } else if (type === 'Fraction') {
        return deepEqual(node1.numerator, node2.numerator) &&
            deepEqual(node1.denominator, node2.denominator);
    } else if (type === 'Negation') {
        return deepEqual(node1.value, node2.value);
    } else if (type === 'Operator') {
        return node1.operator === node2.operator;
    } else if (type === 'Identifier') {
        return node1.name === node2.name;
    } else if (type === 'Literal') {
        return node1.value === node2.value;
    }

    return false;
};

function traverseNode(node, callback) {
    callback(node);
    if (["Expression", "Product"].includes(node.type)) {
        for (const child of node) {
            traverseNode(child, callback);
        }
    } else if (node.type === "Equation") {
        traverseNode(node.left, callback);
        traverseNode(node.right, callback);
    } else if (node.type === "Fraction") {
        traverseNode(node.numerator, callback);
        traverseNode(node.denominator, callback);
    } else if (node.type === "Negation") {
        traverseNode(node.value, callback);
    }
}

module.exports = {
    findNode,
    traverseNode,
    deepEqual,
};

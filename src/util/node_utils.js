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
};

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
    } else if (node.type === "Math") {
        const num = findNode(node.root, id);
        if (num) return num;
    }
    return null;
}

var deepEqual = function(node1, node2) {
    if (node1.type !== node2.type) {
        return false;
    }

    const type = node1.type;

    if (type === 'Expression' || type === 'Product') {
        for (const [child1, child2] of f.zip(node1, node2)) {
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
    } else if (type === 'Math') {
        return deepEqual(node1.root, node2.root);
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
    } else if (node.type === "Math") {
        traverseNode(node.root, callback);
    }
}

const evaluate = function(node, dict = {}) {
    if (node.type === 'Math') {
        return evaluate(node.root, dict);
    } else if (node.type === 'Identifier') {
        // handle well known values such as e and pi
        if (node.name in dict) {
            return dict[node.name];
        } else {
            throw new Error(`${node.name} not found in dict`);
        }
    } else if (node.type === 'Literal') {
        return node.value;
    } else if (node.type === 'Product') {
        let result = 1;

        for (const child of node) {
            if (child.type !== 'Operator') {
                result = result * evaluate(child, dict);
            }
        }

        return result;
    } else if (node.type === 'Expression') {
        let result = 0;
        let op = '+';

        for (const child of node) {
            if (child.type === 'Operator') {
                op = child.operator;
            } else {
                if (op === '+') {
                    result = result + evaluate(child, dict);
                } else if (op === '-') {
                    result = result - evaluate(child, dict);
                }
            }
        }

        return result;
    } else if (node.type === 'Fraction') {
        return evaluate(node.numerator, dict) / evaluate(node.denominator, dict);
    } else if (node.type === 'Negation') {
        return -evaluate(node.value, dict);
    } else {
        return NaN;
    }
};

const getIdentifiers = function(tree) {
    const identifiers = [];

    traverseNode(tree, node => {
        if (node.type === 'Identifier') {
            identifiers.push(node.name);
        }
    });

    return identifiers;
};

const TOLERANCE = 0.00000001;
const EPSILON = 0.00001;
const testValues = [-1000, -100, -10, -1, -0.1, -0.01, -0.001, 0, 0.001, 0.01, 0.1, 1, 10, 100, 1000];

// Returns true if left is an equivalent expression to right
const compare = function(left, right) {
    if (left.type === 'Operator' || right.type === 'Operator') {
        return false;
    }

    const identifiers = new Set();
    for (const id of getIdentifiers(left)) {
        identifiers.add(id);
    }
    for (const id of getIdentifiers(right)) {
        identifiers.add(id);
    }

    const compareDiscontinuity = function(identifiers, dict) {
        if (identifiers.length === 0) {
            const leftValue = evaluate(left, dict);
            const rightValue = evaluate(right, dict);
            if (leftValue === Infinity && rightValue === Infinity) {
                return true;
            } else if (leftValue === -Infinity && rightValue === -Infinity) {
                return true;
            } else {
                return Math.abs(leftValue - rightValue) < TOLERANCE;
            }
        } else {
            const [id, ...remainingIdentifiers] = identifiers;
            const value = dict[id];

            return compareDiscontinuity(
                    remainingIdentifiers, { ...dict, [id]: value - EPSILON }
                ) || compareDiscontinuity(
                    remainingIdentifiers, { ...dict, [id]: value - EPSILON }
                );
        }
    };

    const compareRanges = function(identifiers, dict = {}) {
        if (identifiers.length === 0) {
            const leftValue = evaluate(left, dict);
            const rightValue = evaluate(right, dict);
            if (isNaN(leftValue) && isNaN(rightValue)) {
                return true;
            } else if (leftValue === Infinity && rightValue === Infinity) {
                return true;
            } else if (leftValue === -Infinity && rightValue === -Infinity) {
                return true;
            } else if (!isNaN(leftValue) && isNaN(rightValue) || isNaN(leftValue) && !isNaN(rightValue)) {
                return compareDiscontinuity(Object.keys(dict), dict);
            } else {
                return Math.abs(leftValue - rightValue) < TOLERANCE;
            }
        } else {
            const [id, ...remainingIdentifiers] = identifiers;
            return testValues.reduce((previous, current) => {
                dict[id] = current;
                return previous && compareRanges(remainingIdentifiers, dict);
            }, true);
        }
    };

    return compareRanges(Array.from(identifiers));
};

const getPath = function(node) {
    const path = [];

    while (node != null) {
        path.push(node);
        node = node.parent;
    }

    path.reverse();

    return path;
};

const findCommonAncestor = function (...args) {
    const paths = args.map(node => getPath(node));

    let ancestor = null;
    for (const [first, ...remainder] of f.zip(paths)) {
        if (remainder.every(node => node === first)) {
            ancestor = first;
        }
    }

    return ancestor;
};

module.exports = {
    findNode,
    traverseNode,
    deepEqual,
    evaluate,
    compare,
    getPath,
    findCommonAncestor,
};

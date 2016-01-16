const { Literal } = require('../ast.js');
const { mul } = require('../operations.js');
const { compare } = require('../util/node_utils.js');

function canTransform(selection) {
    return selection.length === 1 && selection.first.type !== 'Operator';
}

function doTransform(selection, newMath) {
    if (canTransform(selection)) {
        const [node] = selection;
        const parent = node.parent;
        const replacement = mul(node.clone(), newMath.clone());

        parent.replace(node, replacement);
    }
}

function validateInput(math, input) {
    if (input.root.type !== 'Equation') {
        return compare(input.root, new Literal(1));
    }
    return false;
}

module.exports = {
    label: 'multiply by one...',
    canTransform,
    doTransform,
    needsUserInput: true,
    validateInput
};
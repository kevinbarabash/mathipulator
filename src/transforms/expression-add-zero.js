const React = require('react');
const Modal = require('../views/modal.js');

const { Literal } = require('../ast.js');
const { add } = require('../operations.js');
const { compare } = require('../util/node_utils.js');

function canTransform(selection) {
    return selection.length === 1 && selection.first.type !== 'Operator';
}

function doTransform(selection, newMath) {
    if (canTransform(selection)) {
        const [node] = selection;
        const parent = node.parent;
        const replacement = add(node.clone(), newMath.clone());

        parent.replace(node, replacement);
    }
}

function validateInput(math, input) {
    if (input.root.type !== 'Equation') {
        return compare(input.root, new Literal(0));
    }
    return false;
}

function getModal(selections, callback) {
    const mathToReplace = selections[0].toExpression();

    return <Modal
        math={mathToReplace}
        callback={callback}
        validateInput={validateInput}
    />;
}


module.exports = {
    label: 'add zero...',
    canTransform,
    doTransform,
    needsUserInput: true,
    getModal
};

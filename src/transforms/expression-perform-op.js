const React = require('react');
const OperationModal = require('../views/operation-modal.js');

const { Literal } = require('../ast.js');
const operations = require('../operations.js');
const { compare } = require('../util/node_utils.js');

function canTransform(selection) {
    return selection.length === 1 && selection.first.type !== 'Operator';
}

function doTransform(selection, options) {
    if (canTransform(selection)) {
        const [node] = selection;
        const op = operations[options.operation];
        if (op) {
            const replacement = op(node.clone(), options.operand.clone());
            node.parent.replace(node, replacement);
        }
    }
}

function validateInput(options) {
    const { operation, operand } = options;

    // TODO: check that operation and operand exist

    if (['add', 'sub'].includes(operation)) {
        return compare(operand, new Literal(0));
    } else if (['mul', 'div'].includes(operation)) {
        return compare(operand, new Literal(1));
    } else {
        throw Error('invalid operation');
    }
    return false;
}

function getModal(selections, callback) {
    const mathToReplace = selections[0].toExpression();

    return <OperationModal
        math={mathToReplace}
        callback={callback}
        validateInput={validateInput}
    />;
}


module.exports = {
    label: 'perform operation',
    canTransform,
    doTransform,
    needsUserInput: true,
    getModal
};

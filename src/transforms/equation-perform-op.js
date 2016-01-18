const React = require('react');
const f = require('functify');

const OperationModal = require('../views/operation-modal.js');
const operations = require('../operations.js');
const { Literal } = require('../ast.js');
const { compare } = require('../util/node_utils.js');

function canTransform(node) {
    // can't do anything with a single node
    return false;
}

function canTransformNodes(selections) {
    if (selections.length == 2) {
        return f(selections).every(([node]) => node.parent.type === 'Equation');
    }
    return false;
}

function transformNodes(selections, options) {
    if (canTransformNodes(selections)) {
        const [first, last] = selections;
        const parent = first.first.parent;

        // TODO: check that each selection is a single node
        const op = operations[options.operation];

        if (op) {
            // need to clone here otherwise we change the AST before the replace
            // which messes things up.
            // need to give exprToAdd clones new id's because we're adding distinct
            // items so they need different ids
            parent.replace(first.first, op(first.first.clone(), options.operand.clone(true)));
            parent.replace(last.first, op(last.first.clone(), options.operand.clone(true)));
        }
    }
}

function getModal(selections, callback) {
    const mathToReplace = selections[0].toExpression();

    return <OperationModal
        math={mathToReplace}
        callback={callback}
        validateInput={validateInput}
    />;
}

function validateInput(options) {
    const { operation, operand } = options;

    if (operation === 'div' && compare(operand, new Literal(0))) {
        return false;
    }
    return true;
}

module.exports = {
    label: 'perform operation',
    canTransform,
    canTransformNodes,
    transformNodes,
    needsUserInput: true,
    getModal
};

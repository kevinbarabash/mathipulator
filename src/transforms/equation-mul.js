const f = require('functify');

const { mul } = require('../operations.js');

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

function transformNodes(selections, exprToAdd) {
    if (canTransformNodes(selections)) {
        const [first, last] = selections;
        const parent = first.first.parent;

        // TODO: check that each selection is a single node

        // need to clone here otherwise we change the AST before the replace
        // which messes things up.
        // need to give exprToAdd clones new id's because we're adding distinct
        // items so they need different ids
        parent.replace(first.first, mul(first.first.clone(), exprToAdd.clone(true)));
        parent.replace(last.first, mul(last.first.clone(), exprToAdd.clone(true)));
    }
}

module.exports = {
    label: 'mul...',
    canTransform,
    canTransformNodes,
    transformNodes,
    needsUserInput: true,
};

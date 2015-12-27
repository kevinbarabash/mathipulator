const { mul } = require('../operations.js');
const { compare } = require('../util/node_utils.js');

function canTransform(node) {
    // can't do anything with a single node
    return false;
}

function canTransformNodes(selections) {
    if (selections.length > 1) {
        if (selections.some(selection => selection.first.parent.type !== 'Product' || selection.first.parent.parent.type !== 'Expression')) {
            return false;
        }

        const grandparent = selections[0].first.parent.parent;

        if (selections.some(selection => selection.first.parent.parent !== grandparent)) {
            return false;
        }

        const expr = selections[0].toExpression();
        if (selections.some(selection => !compare(selection.toExpression(), expr))) {
            return false;
        }

        return true;
    }
    return false;
}

function transformNodes(selections) {
    if (canTransformNodes(selections)) {

        const grandparent = selections[0].first.parent.parent;
        const factor = selections[0].first.clone(true);

        if (grandparent.parent) {
            selections.forEach(selection => {
                selection.first.parent.removeSelection(selection);
            });

            grandparent.parent.replace(grandparent, mul(factor, grandparent));
        }
    }
}

module.exports = {
    label: 'factor',
    canTransform,
    canTransformNodes,
    transformNodes
};

const { Literal } = require('../ast.js');
const { deepEqual } = require('../util/node_utils.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3) {
        const [first, operator, last] = selection;

        if (operator.operator === '-') {
            if (first.prev && first.prev.operator === '-') {
                return false;
            } else {
                return deepEqual(first, last);
            }
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const [first, operator, last] = selection;
        const parent = operator.parent;

        parent.remove(first);
        parent.remove(last);
        parent.replace(operator, new Literal(0));
    }
}

module.exports = {
    label: 'cancel',
    canTransform,
    doTransform
};

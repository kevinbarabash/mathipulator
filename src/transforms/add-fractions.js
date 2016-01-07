const { add, sub, div } = require('../operations.js');
const { deepEqual } = require('../util/node_utils.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3 &&
        selection.first.type === 'Fraction' && selection.last.type == 'Fraction' &&
        selection.first.next.type === 'Operator') {

        // TODO: handle the case where there's a subtraction operator before the first operand
        if (['+', '-'].includes(selection.first.next.operator)) {
            return deepEqual(selection.first.denominator, selection.last.denominator);
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const first = selection.first;
        const last = selection.last;
        const operator = selection.first.next;

        const parent = operator.parent;
        const op = {
            '+': add,
            '-': sub
        }[operator.operator];

        const replacement = div(
            op(first.numerator.clone(), last.numerator.clone()),
            first.denominator.clone()
        );

        parent.remove(first);
        parent.remove(last);
        parent.replace(operator, replacement);

        // collapse if there is only one node in the expression
        if (replacement.prev == null && replacement.next == null) {
            if (parent.parent) {
                parent.parent.replace(parent, replacement);
            }
        }
    }
}

module.exports = {
    label: 'add fractions',
    canTransform,
    doTransform
};

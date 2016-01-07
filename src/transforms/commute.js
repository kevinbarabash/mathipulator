function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3 &&
        selection.first.type === 'Literal' && selection.last.type == 'Literal' &&
        selection.first.next.type === 'Operator') {

        if (selection.first.prev && selection.first.prev.operator === '-') {
            return false;
        }
        if (selection.first.next.operator === '-') {
            return false;
        }
        return true;
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const { first, last } = selection;
        const operator = first.next;
        const parent = operator.parent;
        parent.remove(first);
        parent.remove(last);
        parent.insertAfter(first, operator);
        parent.insertBefore(last, operator);
    }
}

module.exports = {
    label: 'commute',
    canTransform,
    doTransform
};

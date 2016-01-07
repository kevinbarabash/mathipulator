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
        const operator = selection.first.next;
        const parent = operator.parent;
        parent.remove(selection.first);
        parent.remove(selection.last);
        parent.insertAfter(selection.first, operator);
        parent.insertBefore(selection.last, operator);
    }
}

module.exports = {
    label: 'commute',
    canTransform,
    doTransform
};

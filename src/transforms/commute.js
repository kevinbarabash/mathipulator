function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    if (node.type === 'Operator' && ['+', '*'].includes(node.operator)) {
        if (node.prev != null && node.next != null) {
            // handle the case where there's no previous operator
            if (!node.prev.prev) {
                return true;
            }
            if (node.prev.prev && node.prev.prev.operator !== '-') {
                return true;
            }
        } else {
            throw new Error('Invalid expression');
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        const { parent, prev, next } = node;
        parent.remove(prev);
        parent.remove(next);
        parent.insertAfter(prev, node);
        parent.insertBefore(next, node);
    }
}

module.exports = {
    label: 'commute',
    canTransform,
    doTransform
};

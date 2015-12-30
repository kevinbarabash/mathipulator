function canTransform(selection) {
    if (selection.type === 'single' && selection.first.type === 'Operator') {
        return false;
    }
    return true;
}

// transforms should return a promise that resolves when the transform is complete
// this allows for things like replacing the current selection with input from a
// modal or for a user to respond to the 'evaluate' transform asking what the value
// should be
function doTransform(selection, newMath) {
    if (canTransform(selection)) {
        if (selection.type === 'single') {
            const node = selection.first;

            node.parent.replace(node, newMath);
        } else {

            const parent = selection.first.parent;

            if (['Product', 'Expression'].includes(parent.type)) {
                const selExpr = selection.toExpression();
                const prev = selExpr.first.prev;
                const next = selExpr.last.next;
                parent.removeSelection(selExpr, true);

                if (prev) {
                    parent.insertAfter(newMath, prev);
                } else if (next) {
                    parent.insertBefore(newMath, next);
                } else {
                    // we've selected the whole expression in which case the
                    // selection.type is 'single'
                }
            }
        }
    }
}

module.exports = {
    label: 'replace with...',
    canTransform,
    doTransform,
    needsUserInput: true,
};

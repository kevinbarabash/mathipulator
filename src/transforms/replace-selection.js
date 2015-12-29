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

            // TODO: handle expressions/products so that we dont' get unnecessary nesting
            node.parent.replace(node, newMath.root);
        } else {

            // TODO: implement this case
        }
    }
}

module.exports = {
    label: 'replace with...',
    canTransform,
    doTransform,
    needsUserInput: true,
};

function canTransform(selection) {
    if (selection.type === 'range') {
        return false;
    }
    const node = selection.first;
    return node.type === 'Equation';
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const node = selection.first;
        const { left, right } = node;
        node.left = right;
        node.right = left;
    }
}

module.exports = {
    label: 'swap sides',
    canTransform,
    doTransform
};

function canTransform(node) {
    return node.type === 'Equation';
}

function doTransform(node) {
    if (canTransform(node)) {
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

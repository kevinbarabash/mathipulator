function canTransform(node) {
    return node.type === 'Literal' && node.value === 1 &&
        node.parent.type === 'Fraction' && node.parent.denominator === node;
}

function doTransform(node) {
    if (canTransform(node)) {
        const { parent } = node;

        parent.parent.replace(parent, parent.numerator);
    }
}

module.exports = {
    label: 'eliminate division by one',
    canTransform,
    doTransform,
};

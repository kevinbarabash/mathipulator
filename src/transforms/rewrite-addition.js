function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '+') {
        if (node.next && node.next.type === 'Literal' && node.next.value < 0) {
            return true;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        node.operator = '-';

        // TODO: handle negation
        node.next.value = -node.next.value;
    }
}

module.exports = {
    label: 'rewrite addition',
    canTransform,
    doTransform
};

function canTransform(node) {
    if (node.type === 'Operator' && node.operator === '+') {
        if (node.next && node.next.type === 'Literal' && node.next.value < 0) {
            return true;
        } else if (node.next && node.next.type === 'Negation') {
            return true;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        if (node.next.type === 'Literal') {
            node.operator = '-';
            node.next.value = -node.next.value;
        } else if (node.next.type === 'Negation') {
            node.operator = '-';
            node.next = node.next.value;
            node.next.parent = node.parent;
        }
    }
}

module.exports = {
    label: 'rewrite addition',
    canTransform,
    doTransform
};

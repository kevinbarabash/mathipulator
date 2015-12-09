function canTransform(node) {
    if (node && node.parent) {
        if (node.type === 'Expression' && node.parent.type === 'Expression') {
            return node.prev.operator === '+';
        } else {
            return node.type === 'Product' && node.parent.type === 'Product';
        }
    }
    return false;
}

function doTransform(node) {
    if (canTransform(node)) {
        const parent = node.parent;

        node.first.prev = node.prev;
        node.last.next = node.next;
        if (node.prev === null) {
            parent.first = node.first;
        } else {
            node.prev.next = node.first;
        }
        if (node.next === null) {
            parent.last = node.last;
        } else {
            node.next.prev = node.last;
        }
    }
}

module.exports = {
    label: 'remove parentheses',
    canTransform,
    doTransform
};

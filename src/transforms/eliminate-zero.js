function canTransform(node) {
    if (node.type === 'Literal' && node.value === 0) {
        if (node.next && node.prev) {
            return ['+','-'].includes(node.prev.operator) && ['+','-'].includes(node.next.operator);
        } else if (node.next) {
            return ['+','-'].includes(node.next.operator);
        } else if (node.prev) {
            return ['+','-'].includes(node.prev.operator);
        } else {
            return false;
        }
    }
}

function doTransform(node) {
    if (canTransform(node)) {
        if (node.next && node.prev) {
            node.parent.remove(node.prev);
            node.parent.remove(node);
        } else if (node.next) {
            if (node.next.operator === '-') {

            } else {

            }
        } else if (node.prev) {
            node.parent.remove(node.prev);
            node.parent.remove(node);
        }
    }
}

module.exports = {
    label: 'eliminate zero',
    canTransform,
    doTransform
};

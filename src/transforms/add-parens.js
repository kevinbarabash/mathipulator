const {Expression, Product} = require('../ast.js');

function canTransform(selection) {
    const {first, last} = selection;

    // only allow parens around multiple items
    if (selection.type === 'single') {
        return false;
    }

    if (first.parent.type === 'Product' && last.parent.type === 'Product') {
        return first.type !== 'Operator';
    }
    if (first.parent.type === 'Expression' && last.parent.type === 'Expression') {
        if (first.type !== 'Operator') {
            if (first.prev) {
                return first.prev.operator !== '-';
            } else {
                return true;
            }
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const {first, last} = selection;
        const {parent} = first;

        if (parent.type === 'Product') {
            const product = new Product();
            product.prev = first.prev;
            product.next = last.next;
            first.prev = null;
            last.next = null;
            if (product.prev) {
                product.prev.next = product;
            } else {
                parent.first = product;
            }
            if (product.next) {
                product.next.prev = product;
            } else {
                parent.last = product;
            }
            product.first = first;
            product.last = last;
            for (const node of product) {
                node.parent = product;
            }
            product.parent = parent;
        } else if (parent.type === 'Expression') {
            const expression = new Expression();
            expression.prev = first.prev;
            expression.next = last.next;
            first.prev = null;
            last.next = null;
            if (expression.prev) {
                expression.prev.next = expression;
            } else {
                parent.first = expression;
            }
            if (expression.next) {
                expression.next.prev = expression;
            } else {
                parent.last = expression;
            }
            expression.first = first;
            expression.last = last;
            for (const node of expression) {
                node.parent = expression;
            }
            expression.parent = parent;
        } else {
            throw new Error("can't add parentheses");
        }
    }
}

module.exports = {
    label: 'add parentheses',
    canTransform,
    doTransform
};

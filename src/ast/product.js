const f = require('functify');
const ListNode = require('./list-node.js');

class Product extends ListNode {
    constructor(...nodes) {
        super();
        this.type = 'Product';
        this.append(...nodes);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }

    clone(uniqueId = false) {
        const clone = Object.create(Product.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Product.generateId() : this.id;
        clone.append(...f(this).map(x => x.clone(uniqueId)));
        return clone;
    }

    removeSelection(selection) {
    if (selection.first.parent === this && selection.last.parent === this) {
        const nodes = [...selection];

        for (const node of nodes) {
            this.remove(node);
        }

        if (this.first.type === 'Operator') {
            this.remove(this.first);
        }
        if (this.last.type === 'Operator') {
            this.remove(this.last);
        }

        let duplicateOperator = null;
        let i = 0;
        for (const node of this) {
            if (i++ % 2 === 0 && node.type === 'Operator') {
                duplicateOperator = node;
            }
        }
        if (duplicateOperator) {
            this.remove(duplicateOperator);
        }
    }
}
}

module.exports = Product;

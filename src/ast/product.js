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
}

module.exports = Product;

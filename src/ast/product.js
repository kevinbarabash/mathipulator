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

    clone() {
        const clone = Object.create(Product.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.append(...f(this).map(x => x.clone()));
        return clone;
    }
}

module.exports = Product;
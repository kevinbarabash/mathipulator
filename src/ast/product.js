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
        return new Product(...f(this).map(x => x.clone()));
    }
}

module.exports = Product;

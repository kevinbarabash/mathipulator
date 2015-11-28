const f = require('functify');
const ListNode = require('./list-node.js');

class Expression extends ListNode {
    constructor(...nodes) {
        super();
        this.type = 'Expression';
        this.append(...nodes);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }

    clone() {
        const clone = Object.create(Expression.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.append(...f(this).map(x => x.clone()));
        return clone;
    }

    // TODO have a validate method
}

module.exports = Expression;

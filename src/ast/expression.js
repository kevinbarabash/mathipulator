const f = require('functify');
const ListNode = require('./list-node.js');
const Operator = require('./operator.js');

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
        return new Expression(...f(this).map(x => x.clone()));
    }

    // TODO have a validate method
}

module.exports = Expression;

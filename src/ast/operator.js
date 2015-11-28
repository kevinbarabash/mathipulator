const Node = require('./node');

class Operator extends Node {
    constructor(operator) {
        super();
        this.type = 'Operator';
        this.operator = operator;
    }

    toString() {
        return `${this.type}:${this.operator}`;
    }

    clone() {
        const clone = Object.create(Operator.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.operator = this.operator;
        return clone;
    }
}

module.exports = Operator;

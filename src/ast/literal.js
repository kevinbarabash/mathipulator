const Node = require('./node');

class Literal extends Node {
    constructor(value) {
        super();
        Object.assign(this, { type: 'Literal', value });
    }

    toString() {
        return `${this.type}:${this.value}(${this.id})`;
    }

    clone() {
        return new Literal(this.value);
    }
}

module.exports = Literal;

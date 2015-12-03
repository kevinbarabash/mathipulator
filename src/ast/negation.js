const Node = require('./node');

class Negation extends Node {
    constructor(value) {
        super();
        this.type = 'Negation';
        this.value = value; // TODO: come up with a better name
        this.value.parent = this;
    }

    toString() {
        return `[${this.type}:${this.value}]`;
    }

    clone() {
        const clone = Object.create(Negation.prototype);
        clone.id = this.id;
        clone.type = this.type;
        clone.value = this.value.clone();
        clone.value.parent = clone;
        return clone;
    }
}

module.exports = Negation;

const Node = require('./node');

class Literal extends Node {
    constructor(value) {
        super();
        this.type = 'Literal';
        this.value = value;
    }

    toString() {
        return `${this.type}:${this.value}(${this.id})`;
    }

    clone(uniqueId = false) {
        var clone = Object.create(Literal.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Literal.generateId() : this.id;
        clone.value = this.value;
        return clone;
    }
}

module.exports = Literal;

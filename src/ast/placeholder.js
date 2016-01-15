const Node = require('./node.js');

class Identifier extends Node {
    constructor() {
        super();
        this.type = 'Placeholder';
    }

    toString() {
        return `${this.type}:${this.name}`;
    }

    clone(uniqueId = false) {
        const clone = Object.create(Identifier.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Identifier.generateId() : this.id;
        return clone;
    }
}

module.exports = Identifier;

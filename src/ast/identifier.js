const Node = require('./node.js');

class Identifier extends Node {
    constructor(name, options = {}) {
        super();
        this.type = 'Identifier';
        this.name = name;
        this.subscript = options.subscript || null;
        this.accent = options.accent || null;
    }

    toString() {
        return `${this.type}:${this.name}`;
    }

    clone(uniqueId = false) {
        const clone = Object.create(Identifier.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Identifier.generateId() : this.id;
        clone.name = this.name;
        clone.subscript = this.subscript;
        clone.accent = this.accent;
        return clone;
    }
}

module.exports = Identifier;

var Node = require('./node');

class Equation extends Node {
    constructor(left, right) {
        super();
        this.type = 'Equation';
        this.left = left;
        this.right = right;
        this.left.parent = this;
        this.right.parent = this;
    }

    toString() {
        return `${this.type}:[${this.left} = ${this.right}]`;
    }

    clone(uniqueId = false) {
        var clone = Object.create(Equation.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Equation.generateId() : this.id;
        clone.left = this.left.clone(uniqueId);
        clone.right = this.right.clone(uniqueId);
        clone.left.parent = clone;
        clone.right.parent = clone;
        return clone;
    }

    replace(current, replacement) {
        if (this.left === current) {
            this.left = replacement;
            replacement.parent = this;
            current.parent = null;
        } else if (this.right === current) {
            this.right = replacement;
            replacement.parent = this;
            current.parent = null;
        }
    }
}

module.exports = Equation;

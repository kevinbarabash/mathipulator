var Node = require('./node');

class Equation extends Node {
    constructor(left, right) {
        super();
        this.type = 'Equation';
        this.left = left;
        this.right = right;
    }

    toString() {
        return `${this.type}:[${this.left} = ${this.right}]`;
    }

    clone() {
        var clone = Object.create(Equation.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.left = this.left.clone();
        clone.right = this.right.clone();
        return clone;
    }
}

module.exports = Equation;

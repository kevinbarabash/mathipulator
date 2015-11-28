const Node = require('./node');

class Power extends Node {
    constructor(base, exponent) {
        super();
        this.type = 'Power';
        this.base = base;
        this.exponent = exponent;
        this.base.parent = this;
        this.exponent.parent = this;
    }

    toString() {
        return `[${this.type}:${this.base}^${this.exponent}]`;
    }

    clone() {
        const clone = Object.create(Power.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.base = this.base.clone();
        clone.exponent = this.exponent.clone();
        clone.base.parent = clone;
        clone.exponent.parent = clone;
        return clone;
    }
}

module.exports = Power;

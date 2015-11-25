const Node = require('./node');

class Power extends Node {
    constructor(base, exponent) {
        super();
        Object.assign(this, { type: 'Power', base, exponent });
    }

    toString() {
        return `[${this.type}:${this.base}^${this.exponent}]`;
    }

    clone() {
        return new Power(this.base.clone(), this.exponent.clone());
    }
}

module.exports = Power;

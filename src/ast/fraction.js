const Node = require('./node');

class Fraction extends Node {
    constructor(numerator, denominator) {
        super();
        this.type = 'Fraction';
        this.numerator = numerator;
        this.denominator = denominator;
    }

    toString() {
        return `[${this.type}:${this.numerator}/${this.denominator}]`;
    }

    clone() {
        const clone = Object.create(Fraction.prototype);
        clone.type = this.type;
        clone.id = this.id;
        clone.numerator = this.numerator.clone();
        clone.denominator = this.denominator.clone();
        return clone;
    }
}

module.exports = Fraction;

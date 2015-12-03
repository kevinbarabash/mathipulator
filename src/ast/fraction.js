const Node = require('./node');

class Fraction extends Node {
    constructor(numerator, denominator) {
        super();
        this.type = 'Fraction';
        this.numerator = numerator;
        this.denominator = denominator;
        this.numerator.parent = this;
        this.denominator.parent = this;
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
        clone.numerator.parent = clone;
        clone.denominator.parent = clone;
        return clone;
    }

    replace(current, replacement) {
        if (this.numerator === current) {
            this.numerator = replacement;
            replacement.parent = this;
            current.parent = null;
        } else if (this.denominator === current) {
            this.denominator = replacement;
            replacement.parent = this;
            current.parent = null;
        }
    }
}

module.exports = Fraction;

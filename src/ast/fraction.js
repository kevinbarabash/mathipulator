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

    clone(uniqueId = false) {
        const clone = Object.create(Fraction.prototype);
        clone.type = this.type;
        clone.id = uniqueId ? Fraction.generateId() : this.id;
        clone.numerator = this.numerator.clone(uniqueId);
        clone.denominator = this.denominator.clone(uniqueId);
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

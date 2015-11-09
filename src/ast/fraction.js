import Node from './node';
import Expression from './expression';

export default class Fraction extends Node {
    constructor(numerator, denominator) {
        super();
        Object.assign(this, { type: 'Fraction', numerator, denominator });
    }

    toString() {
        return `[${this.type}:${this.numerator}/${this.denominator}]`;
    }

    clone() {
        return new Fraction(this.numerator.clone(), this.denominator.clone());
    }
}

import Node from './node';
import Expression from './expression';

export default class Fraction extends Node {
    constructor(numerator, denominator) {
        super();
        Object.assign(this, { type: 'Fraction', numerator, denominator });
    }

    add(node) {
        return new Expression(this, new Operator('+'), node);
    }

    subtract(node) {
        return new Expression(this, new Operator('-'), node);
    }

    multiply(node) {
        this.append(new Operator('*'), node);
    }

    divide(node) {
        return new Fraction(this, node);
    }

    toString() {
        return `[${this.type}:${this.numerator}/${this.denominator}]`;
    }

    clone() {
        return new Fraction(this.numerator.clone(), this.denominator.clone());
    }
}

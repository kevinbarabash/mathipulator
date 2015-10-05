import Node from './node'

export default class Literal extends Node {
    constructor(value) {
        super();
        Object.assign(this, { type: 'Literal', value });
    }

    add(node) {
        return new Expression(this, new Operator('+'), node);
    }

    subtract(node) {
        return new Expression(this, new Operator('-'), node);
    }

    multiply(node) {
        return new Product(this, new Operator('*'), node);
    }

    divide(node) {
        return new Fraction(this, node);
    }

    toString() {
        return `${this.type}:${this.value}`;
    }

    clone() {
        return new Literal(this.value);
    }
}

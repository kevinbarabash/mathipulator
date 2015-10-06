import Node from './node'
import Expression from './expression'
import Product from './product'
import Fraction from './fraction'

export default class Power extends Node {
    constructor(base, exponent) {
        super();
        Object.assign(this, { type: 'Power', base, exponent });
    }
    
    add(node) {
        return new Expression(this, new Operator('+'), node);
    }
    
    subtract(node) {
        return new Expression(this, new Operator('-'), node);
    }
    
    multiply(node) {
        return new Product(this, node);
    }
    
    divide(node) {
        return new Fraction(this, node);
    }
    
    toString() {
        return `[${this.type}:${this.base}^${this.exponent}]`;
    }
    
    clone() {
        return new Power(this.base.clone(), this.exponent.clone());
    }
}
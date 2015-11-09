import Node from './node'
import Expression from './expression'
import Product from './product'
import Fraction from './fraction'

export default class Power extends Node {
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
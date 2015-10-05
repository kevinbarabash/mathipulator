import Node from './node'
import LinkedList from '../util/linked-list'
import * as f from 'functify'

export default class Product extends Node {
    constructor(...nodes) {
        super();
        this.type = 'Product';
        this.factors = new LinkedList(...nodes);
    }

    add(node) {
        return new Expression(this, new Operator('+'), node);
    }

    subtract(node) {
        return new Expression(this, new Operator('-'), node);
    }

    multiply(node) {
        this.factors.append(new Operator('*'), node);
    }

    divide(node) {
        return new Fraction(this, node);
    }

    toString() {
        return `${this.type}:${this.factors.toString()}`;
    }

    clone() {
        return new Product(...f(this).map(x => x.clone()));
    }
}

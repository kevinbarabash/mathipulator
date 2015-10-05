import * as f from 'functify'
import LinkedList from '../util/linked-list'
import Node from './node'
import Operator from './operator'

export default class Expression extends Node {
    constructor(...nodes) {
        super();
        this.type = 'Expression';
        this.children = new LinkedList(...nodes);
    }

    add(node) {
        this.children.append(new Operator('+'), node);
        return this;
    }

    subtract(node) {
        this.children.append(new Operator('-'), node);
        return this;
    }

    multiply(node) {
        return new Product(this, new Operator('*'), node);
    }

    divide(node) {
        return new Fraction(this, node);
    }

    toString() {
        return `${this.type}:${this.children.toString()}`;
    }

    clone() {
        return new Expression(...f(this).map(x => x.clone()));
    }

    // TODO have a validate method
}

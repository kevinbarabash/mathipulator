import ListNode from './node'
import * as f from 'functify'

export default class Product extends ListNode {
    constructor(...nodes) {
        super();
        this.type = 'Product';
        this.append(...nodes);
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
        return `${this.type}:${super.toString()}`;
    }

    clone() {
        return new Product(...f(this).map(x => x.clone()));
    }
}

import f from 'functify'
import ListNode from './list-node'
import Operator from './operator'

export default class Expression extends ListNode {
    constructor(...nodes) {
        super();
        this.type = 'Expression';
        this.append(...nodes);
    }

    add(node) {
        this.append(new Operator('+'), node);
        return this;
    }

    subtract(node) {
        this.append(new Operator('-'), node);
        return this;
    }

    multiply(node) {
        return new Product(this, new Operator('*'), node);
    }

    divide(node) {
        return new Fraction(this, node);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }

    clone() {
        return new Expression(...f(this).map(x => x.clone()));
    }

    // TODO have a validate method
}

import Node from './node'

export default class Equation extends Node {
    constructor(left, right) {
        super();
        Object.assign(this, { type: 'Equation', left, right });
    }

    add(node) {
        this.left = this.left.add(node.clone());
        this.right = this.right.add(node.clone());
    }

    subtract(node) {
        this.left = this.left.subtract(node);
        this.right = this.right.subtract(node);
    }

    multiply(node) {
        this.left = this.left.multiply(node);
        this.right = this.right.multiply(node);
    }

    divide(node) {
        this.left = this.left.divide(node);
        this.right = this.right.divide(node);
    }

    toString() {
        return `${this.type}:[${this.left} = ${this.right}]`;
    }
}

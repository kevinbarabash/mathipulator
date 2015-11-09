import Node from './node'

export default class Equation extends Node {
    constructor(left, right) {
        super();
        Object.assign(this, { type: 'Equation', left, right });
    }

    toString() {
        return `${this.type}:[${this.left} = ${this.right}]`;
    }
    
    clone() {
        return new Equation(this.left.clone(), this.right.clone());
    }
}

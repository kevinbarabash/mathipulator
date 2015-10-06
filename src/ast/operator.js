import Node from './node'

let operations = {
    '+'(a, b) { return a + b; },
    '-'(a, b) { return a - b; },
    '*'(a, b) { return a * b; },
    '/'(a, b) { return a / b; }     // TODO when/how to keep things as fractions
};

export default class Operator extends Node {
    constructor(operator) {
        super();
        Object.assign(this, { type: 'Operator', operator });
    }

    toString() {
        return `${this.type}:${this.operator}`;
    }

    clone() {
        return new Operator(this.operator);
    }

    evaluate() {
        let prev = this.prev;
        let next = this.next;

        if (prev !== null && next !== null) {
            if (prev.type === 'Literal' && next.next === 'Literal') {
                let result = new Literal(operations[this.operator](prev, next));

                let parent = this[_parent];
                parent.remove(prev);
                parent.remove(next);
                parent.replace(this, result);
            }
        }
    }
}

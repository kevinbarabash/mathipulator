let f = require('functify');

let LinkedList = require('./linked-list.js');
let { _prev, _next, _parent } = LinkedList;

let operations = {
    '+'(a, b) { return a + b; },
    '-'(a, b) { return a - b; },
    '*'(a, b) { return a * b; },
    '/'(a, b) { return a / b; }     // TODO when/how to keep things as fractions
};

let _id = 0;

class Operator {
    constructor(operator) {
        Object.assign(this, { type: 'Operator', id: _id++, operator });
    }
    
    toString() {
        return `${this.type}:${this.operator}`;
    }
    
    clone() {
        return new Operator(this.operator);
    }
    
    evaluate() {
        let prev = this[_prev];
        let next = this[_next];

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

class Literal {
    constructor(value) {
        Object.assign(this, { type: 'Literal', id: _id++, value });
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

class Identifier {
    constructor(name, options = {}) {
        this.type = 'Identifier';
        this.name = name;
        this.subscript = options.subscript || null;
        this.accent = options.accent || null;
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
        return `${this.type}:${this.name}`;
    }

    clone() {
        return new Identifier(this.value);
    }
}

class Product extends LinkedList {
    constructor(...nodes) {
        super();
        this.type = 'Product';
        this.id = _id++;
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

class Fraction {
    constructor(numerator, denominator) {
        Object.assign(this, { type: 'Fraction', id: _id++, numerator, denominator });
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
        return `[${this.type}:${this.numerator}/${this.denominator}]`;
    }
    
    clone() {
        return new Fraction(this.numerator.clone(), this.denominator.clone());
    }
}

class Expression extends LinkedList {
    constructor(...nodes) {
        super();
        this.type = 'Expression';
        this.id = _id++;
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

// TODO support inequalities and not-equal
class Equation {
    constructor(left, right) {
        Object.assign(this, { type: 'Equation', id: _id++, left, right });
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

module.exports = {
    Expression,
    Product,
    Fraction,
    Operator,
    Identifier,
    Literal,
    Equation
};

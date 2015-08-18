let LinkedList = require('./linked-list.js');
let { _prev, _next, _parent } = LinkedList;

class Operator {
    constructor(operator) {
        Object.assign(this, { type: 'Operator', operator });
    }
    
    toString() {
        return `${this.type}:${this.operator}`;
    }
    
    clone() {
        return new Operator(this.operator);
    }
}

class Literal {
    constructor(value) {
        Object.assign(this, { type: 'Literal', value });
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
        return new Fraction(this, new Operator('/'), node);
    }
    
    toString() {
        return `${this.type}:${this.value}`;
    }
    
    clone() {
        return new Literal(this.value);
    }
    
    evaluate() {
        // TODO check if we have a _prev and _next property
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
        return new Fraction(this, new Operator('/'), node);
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
        return new Fraction(this, new Operator('/'), node);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }
}

class Fraction {
    constructor(numerator, denominator) {
        Object.assign(this, { type: 'Fraction', numerator, denominator });
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
        return new Fraction(this, new Operator('/'), node);
    }
    
    toString() {
        return `[${this.type}:${this.numerator}/${this.denominator}]`;
    }
}

class Expression extends LinkedList {
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
        return new Fraction(this, new Operator('/'), node);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }
}

module.exports = {
    Expression,
    Product,
    Fraction,
    Operator,
    Identifier,
    Literal
};


let _next = Symbol();
let _prev = Symbol();
let _parent = Symbol();

class LinkedList {
    constructor(parent) {
        this[_parent] = parent;
        this.first = null;
        this.last = null;   
    }
    
    append(...nodes) {
        for (let node of nodes) {
            node[_next] = null;
            node[_parent] = this[_parent];
            if (this.first === null && this.last === null) {
                this.first = node;
                this.last = node;
                node[_prev] = null;
            } else {
                this.last[_next] = node;
                node[_prev] = this.last;
                this.last = node;
            }
        }
    }
    
    prepend(...nodes) {
        for (let node of nodes) {
            node[_prev] = null;
            node[_parent] = this[_parent];
            if (this.first === null && this.last === null) {
                this.first = node;
                this.last = node;
                node[_next] = null;
            } else {
                this.first[_prev] = node;
                node[_next] = this.first;
                this.first = node;
            }   
        }
    }
    
    replace(current, replacement) {
        replacement[_prev] = current[_prev];
        replacement[_next] = current[_next];
        if (current[_prev] !== null) {
            current[_prev][_next] = replacement;
        }
        if (current[_next] !== null) {
            current[_next][_prev] = replacement;
        }
        current[_prev] = null;
        current[_next] = null;
        if (this.first === current) {
            this.first = replacement;
        }
        if (this.last === current) {
            this.last = replacement;
        }
    }
    
    *[Symbol.iterator]() {
        let node = this.first;
        while (node !== null) {
            // grab the current node so that we can do replacements while
            // iterating
            let current = node;
            node = node[_next];
            yield current;
        }
    }
    
    toString() {
        let result = "[";
        let first = true;
        for (let node of this) {
            if (!first) {
                result += ", ";
            } else {
                first = false;
            }
            result += node.toString();
        }
        result += "]";
        return result;
    }
}

class Operator {
    constructor(operator) {
        this.type = 'Operator';
        this.operator = operator;
    }
    
    toString() {
        return `Operator:${this.operator}`;
    }
    
    clone() {
        return new Operator(this.operator);
    }
}

class Literal {
    constructor(value) {
        this.type = 'Literal';
        this.value = value;
    }
    
    toString() {
        return `Literal:${this.value}`;
    }
    
    clone() {
        return new Literal(this.value);
    }
}

class Term {
    constructor(...nodes) {
        this.type = 'Term';
        this.children = new LinkedList(this);
        this.children.append(...nodes);
    }
    
    add(node) {
        return new Expression(this, new Operator('+'), node);
    }

    subtract(node) {
        return new Expression(this, new Operator('-'), node);
    }
    
    multiply(node) {
        this.children.append(new Operator('*'), node);
    }

    toString() {
        return `Term:${this.children.toString()}`;
    }
}

class Expression {
    constructor(...nodes) {
        this.type = 'Expression';
        this.children = new LinkedList(this);
        this.children.append(...nodes)
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
        return new Term(this, new Operator('*'), node);
    }
    
    toString() {
        return `Expression:${this.children.toString()}`;
    }
}

let expr = new Expression(new Literal(1));
expr.subtract(new Literal(2));
expr.add(new Literal(3));
console.log(expr.toString());

expr = expr.multiply(new Literal(4));
console.log(expr.toString());

expr = expr.add(new Literal(25));
console.log(expr.toString());

let term = new Term(new Literal(4));
term.multiply(new Literal(5));
term.multiply(new Literal(-6));
console.log(term.toString());

module.exports = {
    LinkedList
};

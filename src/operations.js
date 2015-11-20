const {
    Expression,
    Product,
    Fraction,
    Operator,
    Identifier,
    Literal,
    Equation
} = require("./ast.js");

export function removeExtraParens(expr) {
    if (expr.type !== 'Expression') {
        return expr;
    }

    let removalList = [];
    for (let child of expr) {
        if (child.type === 'Expression') {
            if (child.prev == null || child.prev.operator === '+') {
                removalList.push(child);
            }
        }
    }

    for (let removal of removalList) {
        for (let child of removal) {
            child.parent = expr;
        }
        removal.first.prev = removal.prev;
        removal.last.next = removal.next;
        if (removal.prev === null) {
            expr.first = removal.first;
        } else {
            removal.prev.next = removal.first;
        }
        if (removal.next === null) {
            expr.last = removal.last;
        } else {
            removal.next.prev = removal.last;
        }
    }

    return expr;
}

function removeExtraProductParens(prod) {
    let removalList = [];
    for (let child of prod) {
        if (child.type === 'Product') {
            removalList.push(child);
        }
    }

    for (let removal of removalList) {
        for (let child of removal) {
            child.parent = prod;
        }
        removal.first.prev = removal.prev;
        removal.last.next = removal.next;
        if (removal.prev === null) {
            prod.first = removal.first;
        } else {
            removal.prev.next = removal.first;
        }
        if (removal.next === null) {
            prod.last = removal.last;
        } else {
            removal.next.prev = removal.last;
        }
    }

    return prod;
}

export function add(a, b) {
    if (a.type === 'Equation' && b.type === 'Equation') {
        return new Equation(add(a.left, b.left), add(a.right, b.right));
    } else if (a.type === 'Equation' && b.type !== 'Equation') {
        return new Equation(add(a.left, b.clone()), add(a.right, b.clone()));
    } else if (a.type !== 'Equation' && b.type === 'Equation') {
        return new Equation(add(a.clone(), b.left), add(a.clone(), b.right));
    } else {
        return removeExtraParens(new Expression(a, new Operator('+'), b));
    }
}

export function sub(a, b) {
    if (a.type === 'Equation' && b.type === 'Equation') {
        return new Equation(sub(a.left, b.left), sub(a.right, b.right));
    } else if (a.type === 'Equation' && b.type !== 'Equation') {
        return new Equation(sub(a.left, b), sub(a.right, b));
    } else if (a.type !== 'Equation' && b.type === 'Equation') {
        return new Equation(sub(a, b.left), sub(a, b.right));
    } else {
        return removeExtraParens(new Expression(a, new Operator('-'), b));
    }
}

export function mul(a, b) {
    if (a.type === 'Equation' && b.type === 'Equation') {
        throw new Error("can't multiply two equations");
    } else if (a.type === 'Equation' && b.type !== 'Equation') {
        return new Equation(mul(a.left, b), mul(a.right, b));
    } else if (a.type !== 'Equation' && b.type === 'Equation') {
        return new Equation(mul(a, b.left), mul(a, b.right));
    } else {
        return removeExtraProductParens(new Product(a, new Operator('*'), b));
    }
}

export function div(a, b) {
    if (a.type === 'Equation' && b.type === 'Equation') {
        throw new Error("can't divide two equations");
    } else if (a.type === 'Equation' && b.type !== 'Equation') {
        return new Equation(div(a.left, b), div(a.right, b));
    } else if (a.type !== 'Equation' && b.type === 'Equation') {
        return new Equation(div(a, b.left), div(a, b.right));
    } else {
        return new Fraction(a, b);
    }
}

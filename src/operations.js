import {
    Expression,
    Product,
    Fraction,
    Operator,
    Identifier,
    Literal,
    Equation
} from './ast'

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

export function add(a, b) {
    return removeExtraParens(new Expression(a, new Operator('+'), b));
}

export function sub(a, b) {
    return removeExtraParens(new Expression(a, new Operator('-'), b));
}

const {
    Literal,
    Identifier,
    Operator,
    Expression,
    Product,
    Fraction,
    Equation
} = require ('../src/ast.js');

const {
    add,
    sub,
    mul,
    div
} = require('../src/operations.js');

const assert = require('assert');

function processExpression(expr) {
    return [...expr].map(node => {
        return {
            'Literal': node.value,
            'Operator': node.operator,
            'Product': processProduct(node),
            'Expression': processExpression(node)
        }[node.type] || console.log(`${node.type} unexpected`);
    });
}

function processProduct(prod) {
    return [...prod].map(node => {
        return {
            'Literal': node.value,
            'Operator': node.operator,
            'Product': processProduct(node),
            'Expression': processExpression(node)
        }[node.type] || console.log(`${node.type} unexpected`);
    })
}

function assertExpression(expr, array) {
    assert.equal(expr.type, 'Expression');
    assert.deepEqual(processExpression(expr), array);
}

function assertProduct(prod, array) {
    assert.equal(prod.type, 'Product');
    assert.deepEqual(processProduct(prod), array);
}

function assertFraction(frac, array) {
    assert.equal(frac.type, 'Fraction');
    assert.deepEqual([frac.numerator.value, frac.denominator.value], array);
}

describe("adding", () => {
    it("adding should produce an expression", () => {
        const expr = add(new Literal(1), new Literal(2));
        assertExpression(expr, [1, '+', 2]);
    });

    it("should simplify when adding to an expression", () => {
        let expr = add(new Literal(1), new Literal(2));
        expr = add(expr, new Literal(3));
        assertExpression(expr, [1, '+', 2, '+', 3]);
    });

    it("should simplify when adding an expression", () => {
        let expr = add(new Literal(1), new Literal(2));
        expr = add(new Literal(3), expr);
        assertExpression(expr, [3, '+', 1, '+', 2]);
    });
});

describe("subtracting", () => {
    it("should produce an expression", () => {
        const expr = sub(new Literal(1), new Literal(2));
        assertExpression(expr, [1, '-', 2]);
    });

    it("should simplify when subtracting from an expression", () => {
        let expr = add(new Literal(1), new Literal(2));
        expr = sub(expr, new Literal(3));
        assertExpression(expr, [1, '+', 2, '-', 3]);
    });

    it("should not simplify when subtracting an expression", () => {
        let expr = add(new Literal(1), new Literal(2));
        expr = sub(new Literal(3), expr);
        assertExpression(expr, [3, '-', [1, '+', 2]]);
    });
});

describe("multiplying", () => {
    it("should produce a product", () => {
        const prod = mul(new Literal(1), new Literal(2));
        assertProduct(prod, [1, "*", 2]);
    });

    it("should simplify products when multiplying by a product", () => {
        let prod;

        prod = mul(new Literal(1), new Literal(2));
        prod = mul(prod, new Literal(3));
        assertProduct(prod, [1, "*", 2, "*", 3]);

        prod = mul(new Literal(1), new Literal(2));
        prod = mul(new Literal(3), prod);
        assertProduct(prod, [3, "*", 1, "*", 2]);
    });
});

describe("dividing", () => {
    it("should produce a fraction", () => {
        const frac  = div(new Literal(1), new Literal(2));
        assertFraction(frac, [1, 2]);
    })
});

const assert = require('assert');

const { Literal } = require ('../src/ast.js');
const { add, sub, mul, div } = require('../src/operations.js');
const { assertExpression, assertProduct, assertFraction, } = require('./test_util.js');

describe("ast", () => {
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
            assertFraction(frac, [1, '/', 2]);
        })
    });
});

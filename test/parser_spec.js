const assert = require('assert');

const { assertExpression, assertProduct, assertFraction, } = require('./test_util.js');

const Parser = require('../src/parser.js');

const assertLiteral = function(actual, expectedValue) {
    assert.equal(actual.type, 'Literal');
    assert.equal(actual.value, expectedValue);
};

describe('Parser', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    it('should parse expressions', () => {
        const expr = parser.parse('1+2-3*4/5');
        assert.ok(expr);
    });

    describe('addition/subtraction', () => {
        // TODO: write these tests
    });

    describe('multiplication', () => {
        it('should parse 2x as a product of 2 and x', () => {
            const prod = parser.parse('2x');
            assertProduct(prod, [2, '*', 'x']);
        });

        it('should parse -2x as a product of -2 and x', () => {
            const prod = parser.parse('-2x');
            assertProduct(prod, [-2, '*', 'x']);
        });

        it('should parse ab as a product of a and b', () => {
            const prod = parser.parse('ab');
            assertProduct(prod, ['a', '*', 'b']);
        });

        it('should parse -ab as a product of -a and b', () => {
            const prod = parser.parse('-ab');
            assertProduct(prod, [['-', 'a'], '*', 'b']);
        })
    });

    describe('division', () => {
        it('should parse division as a fraction', () => {
            const frac = parser.parse('4/5');
            assert.equal(frac.type, 'Fraction');
            assertLiteral(frac.numerator, 4);
            assertLiteral(frac.denominator, 5);
        });

        it('should parse nested fractions', () => {
            const frac = parser.parse('1/2/3');
            assert.equal(frac.type, 'Fraction');
            assertLiteral(frac.denominator, 3);

            assert.equal(frac.numerator.type, 'Fraction');
            assertLiteral(frac.numerator.numerator, 1);
            assertLiteral(frac.numerator.denominator, 2);
        });

        it('should parse rational expressions', () => {
            const frac = parser.parse('(1+x)/(1-y)');
            assertFraction(frac, [[1, '+', 'x'], '/', [1, '-', 'y']]);
        });
    });
});

require('babel-polyfill');
const assert = require('assert');

const { assertExpression, assertProduct, assertFraction } = require('./test_util.js');

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

    describe('Expressions', () => {
        it('should parse 1+2-3-4', () => {
            const expr = parser.parse('1+2-3-4');
            assertExpression(expr.root, [1, '+', 2, '-', 3, '-', 4]);
        });

        it('should parse x+y-z', () => {
            const expr = parser.parse('x+y-z');
            assertExpression(expr.root, ['x', '+', 'y', '-', 'z']);
        });
    });

    describe('Products', () => {
        it('should parse 2x as a product of 2 and x', () => {
            const prod = parser.parse('2x');
            assertProduct(prod.root, [2, '*', 'x']);
        });

        it('should parse -2x as a product of -2 and x', () => {
            const prod = parser.parse('-2x');
            assertProduct(prod.root, [-2, '*', 'x']);
        });

        it('should parse ab as a product of a and b', () => {
            const prod = parser.parse('ab');
            assertProduct(prod.root, ['a', '*', 'b']);
        });

        it('should parse -ab as a product of -a and b', () => {
            const prod = parser.parse('-ab');
            assertProduct(prod.root, [['-', 'a'], '*', 'b']);
        });

        it('should parse (2)(3) as a product of 2 and 3', () => {
            const prod = parser.parse('(2)(3)');
            assertProduct(prod.root, [2, '*', 3]);
        });

        it('should parse 2(3) as a product of 2 and 3', () => {
            const prod = parser.parse('2(3)');
            assertProduct(prod.root, [2, '*', 3]);
        });
    });

    describe('Fractions', () => {
        it('should parse division as a fraction', () => {
            const frac = parser.parse('4/5').root;
            assert.equal(frac.type, 'Fraction');
            assertLiteral(frac.numerator, 4);
            assertLiteral(frac.denominator, 5);
        });

        it('should parse nested fractions', () => {
            const frac = parser.parse('1/2/3').root;
            assert.equal(frac.type, 'Fraction');
            assertLiteral(frac.denominator, 3);

            assert.equal(frac.numerator.type, 'Fraction');
            assertLiteral(frac.numerator.numerator, 1);
            assertLiteral(frac.numerator.denominator, 2);
        });

        it('should parse addition/subtraction of fractions', () => {
            const expr = parser.parse('1/2+3/4-5/6').root;
            assertExpression(expr, [[1, '/', 2], '+', [3, '/', 4], '-', [5, '/', 6]]);
        });

        it('should parse rational expressions', () => {
            const frac = parser.parse('(1+x)/(1-y)').root;
            assertFraction(frac, [[1, '+', 'x'], '/', [1, '-', 'y']]);
        });
    });
});

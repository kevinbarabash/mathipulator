require('babel-polyfill');
const assert = require('assert');

const { Literal, Identifier, Operator } = require('../src/ast.js');
const Parser = require('../src/parser.js');
const { deepEqual, evaluate, compare } = require('../src/util/node_utils.js');

function assertDeepEqual(node1, node2) {
    assert.equal(deepEqual(node1, node2), true);
}

function assertNotEqual(node1, node2) {
    assert.equal(deepEqual(node1, node2), false);
}

const TOLERANCE = 0.000000001;

function assertCloseEnough(value1, value2) {
    assert.ok(Math.abs(value1 - value2) < TOLERANCE, `${value1} is not close enough to ${value2}`);
}

describe('node_utils', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    describe('deepEqual', () => {
        it('atomic nodes', () => {
            assertDeepEqual(new Literal(5), new Literal(5));
            assertNotEqual(new Literal(5), new Literal(10));

            assertDeepEqual(new Operator('+'), new Operator('+'));
            assertNotEqual(new Operator('+'), new Operator('-'));

            assertDeepEqual(new Identifier('a'), new Identifier('a'));
            assertNotEqual(new Identifier('a'), new Identifier('b'));
        });

        it('expressions', () => {
            const expr1 = parser.parse('1+2-(a+b)');
            const expr2 = parser.parse('1+2-(a+b)');
            assertDeepEqual(expr1, expr2);
        });

        it('expressions of fractions', () => {
            const expr1 = parser.parse('1/2+a/b');
            const expr2 = parser.parse('1/2+a/b');
            assertDeepEqual(expr1, expr2);
        });

        it('expressions of products', () => {
            const expr1 = parser.parse('ad-bc');
            const expr2 = parser.parse('ad-bc');
            assertDeepEqual(expr1, expr2);
        });

        it('equations', () => {
            const eqn1 = parser.parse('2x+5=10');
            const eqn2 = parser.parse('2x+5=10');
            assertDeepEqual(eqn1, eqn2);
        });

        it('fractions', () => {
            const frac1 = parser.parse('1/(x-1/x)');
            const frac2 = parser.parse('1/(x-1/x)');
            assertDeepEqual(frac1, frac2);
        });

        it('products', () => {
            const prod1 = parser.parse('2*(3*x*x)*y');
            const prod2 = parser.parse('2*(3*x*x)*y');
            assertDeepEqual(prod1, prod2);
        });

        it('negation', () => {
            const neg1 = parser.parse('-c');
            const neg2 = parser.parse('-c');
            assertDeepEqual(neg1, neg2);
        });
    });

    describe('evaluate', () => {
        it('adding fractions', () => {
            const expr = parser.parse('1/10 + 2/10');
            assertCloseEnough(evaluate(expr), 0.3);
        });

        it('adding fractions with variables', () => {
            const expr = parser.parse('x/10 + y/10');
            const dict = {
                x: 1,
                y: 2
            };
            assertCloseEnough(evaluate(expr, dict), 0.3);
        });

        it('should throw if an identifier is not the dict', () => {
            const expr = parser.parse('x/10 + y/10');
            const dict = {
                x: 1
            };
            assert.throws(() => {
                evaluate(expr, dict);
            });
        });
    });

    describe('compare', () => {
        it('compare expression without variables', () => {
            assert.ok(compare(parser.parse('1/10 + 2/10'), new Literal(0.3)));
        });

        it('compare expression with one variable with a constant', () => {
            assert.ok(compare(parser.parse('x/(x+x)'), new Literal(0.5)));
            assert.ok(compare(parser.parse('2x/x'), new Literal(2)));
            assert.ok(compare(parser.parse('x-x'), new Literal(0)));
            assert.ok(compare(parser.parse('x+(-x)'), new Literal(0)));
        });

        it('compare different one variable expressions', () => {
            assert.ok(compare(parser.parse('2x'), parser.parse('x+x')));
            assert.ok(compare(parser.parse('1/(1+x)'), parser.parse('1/(x+1)')));
        });

        it('compare expression with two variables', () => {
            assert.ok(compare(parser.parse('(x+y)/(x*y)'), parser.parse('1/x + 1/y')));
        });
    });
});

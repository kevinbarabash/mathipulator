const assert = require('assert');

const { Literal, Identifier, Operator } = require('../src/ast.js');
const Parser = require('../src/parser.js');
const { deepEqual } = require('../src/util/node_utils.js');

function assertDeepEqual(node1, node2) {
    assert.equal(deepEqual(node1, node2), true);
}

function assertNotEqual(node1, node2) {
    assert.equal(deepEqual(node1, node2), false);
}

describe('node_utils', () => {
    describe('deepEqual', () => {
        let parser;

        beforeEach(() => {
            parser = new Parser();
        });

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
});

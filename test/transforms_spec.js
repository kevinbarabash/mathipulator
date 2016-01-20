const assert = require('assert');

const { commute } = require('../src/transforms.js');
const Parser = require('../src/parser.js');
const Selection = require('../src/views/selection.js');
const { deepEqual } = require('../src/util/node_utils.js');

describe('commute', () => {
    let parser;

    const parse = text => parser.parse(text).root;

    const assertExpr = (expr, text) => assert.ok(deepEqual(expr, parse(text)));

    beforeEach(() => {
        parser = new Parser();
    });

    it('should commute addition', () => {
        const expr = parse('1+2');
        const sel = new Selection(expr.first, expr.last);
        assert.ok(commute.canTransform(sel));

        commute.doTransform(sel);
        assertExpr(expr, '2+1');
    });

    it('should commute addition within an expression', () => {
        const expr = parse('1+2+3+4');
        const sel = new Selection(expr.first.next.next, expr.last.prev.prev);
        assert.ok(commute.canTransform(sel));

        commute.doTransform(sel);
        assertExpr(expr, '1+3+2+4');
    });

    it('should commute a selected expression that contains only one addition', () => {
        const expr = parse('1+2');
        const sel = new Selection(expr);
        assert.ok(commute.canTransform(sel));

        commute.doTransform(sel);
        assertExpr(expr, '2+1');
    });

    it('should not commute a selected expression with more than one addition', () => {
        const expr = parse('1+2+3');
        const sel = new Selection(expr);
        assert.equal(commute.canTransform(sel), false);
    });

    it('should not commute more than one addition', () => {
        const expr = parse('1+2+3');
        const sel = new Selection(expr.first, expr.last);
        assert.equal(commute.canTransform(sel), false);
    });

    it('should not commute subtraction', () => {
        const expr = parse('1-2');
        const sel = new Selection(expr.first, expr.last);
        assert.equal(commute.canTransform(sel), false);
    });

    it('should not commute with subtraction in front of the first term', () => {
        const expr = parse('1-2+3');
        const sel = new Selection(expr.last.prev.prev, expr.last);
        assert.equal(commute.canTransform(sel), false);
    });
});

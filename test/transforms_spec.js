const assert = require('assert');

const { commute } = require('../src/transforms.js');
const Parser = require('../src/parser.js');
const Selection = require('../src/views/selection.js');

describe.only('commute', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    it('should commute addition', () => {
        const expr = parser.parse('1+2').root;
        const sel = new Selection(expr.first, expr.last);
        assert.ok(commute.canTransform(sel));
    });

    it('should commute addition within an expression', () => {
        const expr = parser.parse('1+2+3+4').root;
        const sel = new Selection(expr.first.next.next, expr.last.prev.prev);
        assert.ok(commute.canTransform(sel));
    });

    it('should commute a selected expression that contains only one addition', () => {
        const expr = parser.parse('1+2').root;
        const sel = new Selection(expr);
        assert.ok(commute.canTransform(sel));
    });

    it('should not commute a selected expression with more than one addition', () => {
        const expr = parser.parse('1+2+3').root;
        const sel = new Selection(expr);
        assert.equal(commute.canTransform(sel), false);
    });

    it('should not commute more than one addition', () => {
        const expr = parser.parse('1+2+3').root;
        const sel = new Selection(expr.first, expr.last);
        assert.equal(commute.canTransform(sel), false);
    });

    it('should not commute subtraction', () => {
        const expr = parser.parse('1-2').root;
        const sel = new Selection(expr.first, expr.last);
        assert.equal(commute.canTransform(sel), false);
    });
});

const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');
const Negation = require('../ast/negation.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3 &&
        selection.first.type === 'Literal' && selection.last.type == 'Literal' &&
        selection.first.next.type === 'Operator') {

        return selection.first.next.operator === '-';
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        const operator = selection.first.next;
        const parent = operator.parent;
        const next = selection.last;

        if (next.type === 'Literal' && next.value > 0) {
            parent.replace(next, new Literal(-next.value));
        } else {
            parent.replace(next, new Negation(next));
        }

        parent.replace(operator, new Operator('+'));
    }
}

module.exports = {
    label: 'rewrite subtraction',
    canTransform,
    doTransform
};

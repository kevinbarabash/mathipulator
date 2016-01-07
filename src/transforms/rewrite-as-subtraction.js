const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3 &&
        selection.first.type === 'Literal' && selection.last.type == 'Literal' &&
        selection.first.next.type === 'Operator') {

        const last = selection.last;

        if (last.type === 'Literal' && last.value < 0) {
            return true;
        } else if (last.type === 'Negation') {
            return true;
        }
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const last = selection.last;
        const operator = last.prev;
        const parent = last.parent;

        if (last.type === 'Literal' && last.value < 0) {
            parent.replace(last, new Literal(-last.value));
        } else if (last.type === 'Negation') {
            parent.replace(last, last.value);
        }

        parent.replace(operator, new Operator('-'));
    }
}

module.exports = {
    label: 'rewrite as subtraction',
    canTransform,
    doTransform
};

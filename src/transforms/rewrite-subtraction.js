const Literal = require('../ast/literal.js');
const Operator = require('../ast/operator.js');
const Negation = require('../ast/negation.js');

function canTransform(selection) {
    if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
        selection = selection.first;
    }
    if (selection.length === 3) {
        const [ , operator, ] = selection;
        return operator.operator === '-';
    }
    return false;
}

function doTransform(selection) {
    if (canTransform(selection)) {
        if (selection.length === 1 && ['Expression', 'Product'].includes(selection.first.type)) {
            selection = selection.first;
        }
        const [ , operator, last] = selection;
        const parent = operator.parent;

        if (last.type === 'Literal' && last.value > 0) {
            parent.replace(last, new Literal(-last.value));
        } else if (last.type === 'Product') {
            const firstFactor = last.first;
            if (firstFactor.type === 'Literal' && firstFactor.value > 0) {
                last.replace(firstFactor, new Literal(-firstFactor.value));
            } else {
                last.replace(firstFactor, new Negation(firstFactor));
            }
        } else {
            parent.replace(last, new Negation(last));
        }

        parent.replace(operator, new Operator('+'));
    }
}

module.exports = {
    label: 'rewrite subtraction',
    canTransform,
    doTransform
};

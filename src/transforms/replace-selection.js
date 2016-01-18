const React = require('react');
const Modal = require('../views/modal.js');

function canTransform(selection) {
    if (selection.type === 'single') {
        if (selection.first.type === 'Literal') {
            return true;
        } else if (selection.first.type === 'Fraction') {
            const { numerator, denominator } = selection.first;
            if (numerator.type === 'Literal' && denominator.type === 'Literal') {
                return true;
            }
        }
    }
    return false;
}

function doTransform(selection, newMath) {
    if (canTransform(selection)) {
        if (selection.type === 'single') {
            const node = selection.first;

            node.parent.replace(node, newMath);
        } else {

            const parent = selection.first.parent;

            if (['Product', 'Expression'].includes(parent.type)) {
                const selExpr = selection.toExpression();
                const prev = selExpr.first.prev;
                const next = selExpr.last.next;
                parent.removeSelection(selExpr, true);

                if (prev) {
                    parent.insertAfter(newMath, prev);
                } else if (next) {
                    parent.insertBefore(newMath, next);
                } else {
                    // we've selected the whole expression in which case the
                    // selection.type is 'single'
                }
            }
        }
    }
}

function getModal(selections, callback) {
    const mathToReplace = selections[0].toExpression();

    return <Modal
        math={mathToReplace}
        callback={callback}
    />;
}

module.exports = {
    label: 'replace',
    canTransform,
    doTransform,
    needsUserInput: true,
    getModal
};

const assert = require('assert');

var processNode = function(node) {
    switch (node.type) {
        case 'Literal': return node.value; break;
        case 'Operator': return node.operator; break;
        case 'Identifier': return node.name; break;
        case 'Product': return processProduct(node); break;
        case 'Expression': return processExpression(node); break;
        case 'Negation': return processNegation(node); break;
        case 'Fraction': return processFraction(node); break;
        default: console.log(`${node.type} unexpected`);
    }
};

function processExpression(expr) {
    return [...expr].map(processNode);
}

function processProduct(prod) {
    return [...prod].map(processNode);
}

function processFraction(frac) {
    return [processNode(frac.numerator), '/', processNode(frac.denominator)];
}

function processNegation(neg) {
    return ['-', processNode(neg.value)];
}

function assertExpression(expr, array) {
    assert.equal(expr.type, 'Expression');
    assert.deepEqual(processExpression(expr), array);
}

function assertProduct(prod, array) {
    assert.equal(prod.type, 'Product');
    assert.deepEqual(processProduct(prod), array);
}

function assertFraction(frac, array) {
    assert.equal(frac.type, 'Fraction');
    assert.deepEqual(processFraction(frac), array);
}

module.exports = {
    assertExpression,
    assertProduct,
    assertFraction,
    processNode,
};

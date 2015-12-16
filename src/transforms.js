const evaluate = require('./transforms/evaluate.js');
const rewriteSubtraction = require('./transforms/rewrite-subtraction.js');
const rewriteAsSubtraction = require('./transforms/rewrite-as-subtraction.js');
const rewriteDivision = require('./transforms/rewrite-division.js');
const rewriteAsDivision = require('./transforms/rewrite-as-division.js');
const rewriteNegation = require('./transforms/rewrite-negation.js');
const rewriteAsNegation = require('./transforms/rewrite-as-negation.js');
const commute = require('./transforms/commute.js');
const distributeForwards = require('./transforms/distribute-forwards.js');
const distributeBackwards = require('./transforms/distribute-backwards.js');
const eliminateZero = require('./transforms/eliminate-zero.js');
const eliminateOne = require('./transforms/eliminate-one.js');
const swapSides = require('./transforms/swap-sides.js');
const removeParentheses = require('./transforms/remove-parentheses.js');
const multiplyFractions = require('./transforms/multiply-fractions.js');
const addFractions = require('./transforms/add-fractions.js');
const simplifyToZero = require('./transforms/simplify-to-zero.js');

module.exports = {
    commute,
    evaluate,
    rewriteSubtraction,
    rewriteAsSubtraction,
    rewriteDivision,
    rewriteAsDivision,
    rewriteNegation,
    rewriteAsNegation,
    distributeForwards,
    distributeBackwards,
    eliminateZero,
    eliminateOne,
    swapSides,
    removeParentheses,
    multiplyFractions,
    addFractions,
    simplifyToZero,
    cancelAddition: require('./transforms/cancel-addition.js'),
    cancelSubtraction: require('./transforms/cancel-subtraction.js'),
};

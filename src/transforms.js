module.exports = {
    // single node transforms
    commute: require('./transforms/commute.js'),
    evaluate: require('./transforms/evaluate.js'),
    rewriteSubtraction: require('./transforms/rewrite-subtraction.js'),
    rewriteAsSubtraction: require('./transforms/rewrite-as-subtraction.js'),
    rewriteDivision: require('./transforms/rewrite-division.js'),
    rewriteAsDivision: require('./transforms/rewrite-as-division.js'),
    rewriteNegation: require('./transforms/rewrite-negation.js'),
    rewriteAsNegation: require('./transforms/rewrite-as-negation.js'),
    distributeForwards: require('./transforms/distribute-forwards.js'),
    distributeBackwards: require('./transforms/distribute-backwards.js'),
    eliminateZero: require('./transforms/eliminate-zero.js'),
    eliminateOne: require('./transforms/eliminate-one.js'),
    eliminateDivByOne: require('./transforms/eliminate-div-by-one.js'),
    swapSides: require('./transforms/swap-sides.js'),
    removeParentheses: require('./transforms/remove-parens.js'),
    multiplyFractions: require('./transforms/multiply-fractions.js'),
    addFractions: require('./transforms/add-fractions.js'),
    simplifyToZero: require('./transforms/simplify-to-zero.js'),
    cancelAddition: require('./transforms/cancel-addition.js'),
    cancelSubtraction: require('./transforms/cancel-subtraction.js'),
    primeFactorization: require('./transforms/prime-factorization.js'),

    // multi-node transforms
    cancelFactor: require('./transforms/cancel-factor.js'),
};

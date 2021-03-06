module.exports = {
    // single node transforms
    commute: require('./transforms/commute.js'),
    evaluate: require('./transforms/evaluate.js'),
    replaceWith: require('./transforms/replace-selection.js'),

    simplifyToZero: require('./transforms/simplify-to-zero.js'),
    cancelAddition: require('./transforms/cancel-addition.js'),
    cancelSubtraction: require('./transforms/cancel-subtraction.js'),
    collectLikeTerms: require('./transforms/collect-like-terms.js'),

    // negatives
    rewriteSubtraction: require('./transforms/rewrite-subtraction.js'),
    rewriteAsSubtraction: require('./transforms/rewrite-as-subtraction.js'),
    rewriteNegation: require('./transforms/rewrite-negation.js'),
    rewriteAsNegation: require('./transforms/rewrite-as-negation.js'),

    // distribution/fractoring
    factor: require('./transforms/factor.js'),
    primeFactorization: require('./transforms/prime-factorization.js'),
    distributeForwards: require('./transforms/distribute-forwards.js'),
    distributeBackwards: require('./transforms/distribute-backwards.js'),

    // identities
    eliminateZero: require('./transforms/eliminate-zero.js'),
    eliminateOne: require('./transforms/eliminate-one.js'),
    eliminateDivByOne: require('./transforms/eliminate-div-by-one.js'),

    // fractions
    rewriteDivision: require('./transforms/rewrite-division.js'),
    rewriteAsDivision: require('./transforms/rewrite-as-division.js'),
    multiplyFractions: require('./transforms/multiply-fractions.js'),
    addFractions: require('./transforms/add-fractions.js'),
    splitFractionAddition: require('./transforms/split-fraction-addition.js'),
    splitFractionMultiplication: require('./transforms/split-fraction-multiplication.js'),

    // parentheses
    addParentheses: require('./transforms/add-parens.js'),
    removeParentheses: require('./transforms/remove-parens.js'),

    // equations
    swapSides: require('./transforms/swap-sides.js'),
    equationPerformOp: require('./transforms/equation-perform-op.js'),

    // expressions
    expressionPerformOp: require('./transforms/expression-perform-op.js'),

    // multi-node transforms
    cancelFactor: require('./transforms/cancel-factor.js')
};

const evaluate = require('./transforms/evaluate.js');
const rewriteAddition = require('./transforms/rewrite-addition.js');
const rewriteSubtraction = require('./transforms/rewrite-subtraction.js');

module.exports = {
    evaluate,
    rewriteAddition,
    rewriteSubtraction
};

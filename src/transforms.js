const evaluate = require('./transforms/evaluate.js');
const rewriteAddition = require('./transforms/rewrite-addition.js');
const rewriteSubtraction = require('./transforms/rewrite-subtraction.js');
const commute = require('./transforms/commute.js');
const distributeForwards = require('./transforms/distribute-forwards.js');
const distributeBackwards = require('./transforms/distribute-backwards.js');
const eliminateZero = require('./transforms/eliminate-zero.js');
const swapSides = require('./transforms/swap-sides.js');

module.exports = {
    commute,
    evaluate,
    rewriteAddition,
    rewriteSubtraction,
    distributeForwards,
    distributeBackwards,
    eliminateZero,
    swapSides,
};
// no inheritance
var expr = {
    type: 'Expression',
    children: [1, '+', 'a', '-', 3, '-', '-4', '+', '-b']
};

// Notes:
// Children is an array of subexpressions separate addops.
// Possible addops: '+', '-', '\u00B1' (or 'pm'), and '\u2213' (or 'mp')
// TODO decide whether to use unicode symbols or not
// When splitting expressions, pm/mp determine the order of the resultant expressions in a list

// idenfitifer < expression
var identifier = {
    type: 'Identifier',
    name: 'a',      // unicode char,
    subscript: {},  // expression, nullable
    accent: {}      // nullable, or one of 'dot', 'arrow', 'hat', etc.
};

// Notes:
// The "value" of an identifier is a separate concern, these can be stored in
// a lookup table.  Variables will change over time, constants will not.  Some
// constants may be pre-defined such as \u03B8 (\theta)
// We'll want to know what's a constant and what's not in transforms.js

// number < expression
var num = {
    type: 'Number',
    value: -4.1   // N, Z, Q, R, stop, C?, quaternions? these can be separate constructions
};

var neg = {
    type: 'Negative',
    expression: {}  // expression
};

// TODO bignum to store numbers

// product < expression
var prod = {
    type: 'Product',
    factors: [ /* expressions */ ]

    // children are multiplied in the order they appear
    // no '*' are necessary
};

var quot = {
    type: 'Quotient',
    numerator: {},      // expression
    denominator: {}     // expression
};

// power < expression
var pow = {
    type: 'Power',
    base: {},       // expression
    exponent: {}    // expression
};

// function < expression
var func_app = {
    type: 'FunctionApplication',
    name: 'Sqrt',   // sin, cos, tan, etc.
    args: [ /* expressions */ ]
};

// no inheritance
var func_def = {
    type: 'FunctionDefinition',
    params: [ /* variables */ ], // the signs of variables are ignored
    definition: {}  // expression
};

// no inheritance
var eqn = {
    type: 'Equation',
    left: {},   // expression
    right: {}   // epxression
};

// not an expression
var list = {
    type: 'List',
    children: [ /* expressions */ ]
};

// vector < expression
var vector = {
    type: 'Vector',
    components: [ /* expressions */ ]
};

// Parentheses
// Any expression or subclass of expression can have an optional "parens" prop
// with a boolean value which specifies whether or not parentheses should be
// added.  In some cases, parenetheses must be added.  In all other cases, the
// value of "parens" will be honored when rendering

// TODO: matrices, system of equations

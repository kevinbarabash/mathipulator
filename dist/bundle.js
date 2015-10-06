/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(1);

	var Expression = _require.Expression;
	var Literal = _require.Literal;
	var Product = _require.Product;
	var Fraction = _require.Fraction;
	var Identifier = _require.Identifier;
	var Operator = _require.Operator;
	var Equation = _require.Equation;

	var _require2 = __webpack_require__(97);

	var layout = _require2.layout;
	var render = _require2.render;
	var lerpLayout = _require2.lerpLayout;
	var ctx = _require2.ctx;

	var expr1 = new Expression(new Literal(1));
	expr1.add(new Literal(3));
	console.log(expr1.toString());

	var expr2 = new Expression(new Literal(5));
	expr2.subtract(new Literal(-2));

	var eqn1 = new Equation(expr1, expr2);
	var l1 = layout(eqn1);

	var ids = Object.keys(l1);

	eqn1.add(new Literal(25));
	var l2 = layout(eqn1);

	console.log(eqn1.toString());

	console.log(l1);
	console.log(l2);

	var equalsWidth = ctx.measureText("=").width;

	var t = 0;

	// TODO: figure out a better way to handle a series of animations

	function easeQuadratic(t) {
	    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	function easeCubic(t) {
	    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	}

	function easeInCubic(t) {
	    return t * t * t;
	}

	function easeOutCubic(t) {
	    return --t * t * t + 1;
	}

	function findEquals(layout) {
	    var result = null;
	    Object.keys(layout).forEach(function (id) {
	        var leaf = layout[id];
	        if (leaf.text === '=') {
	            result = leaf;
	        }
	    });
	    return result;
	}

	function drawAxes(ctx) {
	    var width = 1200;
	    var height = 700;
	    ctx.strokeStyle = 'red';
	    ctx.beginPath();
	    ctx.moveTo(width / 2, 0);
	    ctx.lineTo(width / 2, height);
	    ctx.moveTo(0, height / 2);
	    ctx.lineTo(width, height / 2);
	    ctx.stroke();
	}

	function draw1() {
	    ctx.clearRect(0, 0, 1200, 700);
	    drawAxes(ctx);

	    var l3 = lerpLayout(l1, l2, ids, easeCubic(t));
	    var equals = findEquals(l3);

	    ctx.save();
	    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
	    render(l3, ids);
	    ctx.restore();

	    if (t < 1) {
	        t += 0.03;
	        requestAnimationFrame(draw1);
	    } else {
	        t = 0;
	        requestAnimationFrame(draw2);
	    }
	}

	function draw2() {
	    ctx.clearRect(0, 0, 1200, 700);
	    drawAxes(ctx);

	    var equals = findEquals(l2);

	    ctx.save();
	    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
	    render(l2, ids, easeOutCubic(t));
	    ctx.restore();

	    if (t < 1) {
	        t += 0.03;
	        requestAnimationFrame(draw2);
	    } else {}
	}

	draw1();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _astExpression = __webpack_require__(2);

	var _astExpression2 = _interopRequireDefault(_astExpression);

	var _astExpression3 = _interopRequireDefault(_astExpression);

	var _astFraction = __webpack_require__(93);

	var _astFraction2 = _interopRequireDefault(_astFraction);

	var _astOperator = __webpack_require__(91);

	var _astOperator2 = _interopRequireDefault(_astOperator);

	var _astIdentifier = __webpack_require__(94);

	var _astIdentifier2 = _interopRequireDefault(_astIdentifier);

	var _astLiteral = __webpack_require__(95);

	var _astLiteral2 = _interopRequireDefault(_astLiteral);

	var _astEquation = __webpack_require__(96);

	var _astEquation2 = _interopRequireDefault(_astEquation);

	module.exports = {
	    Expression: _astExpression2['default'],
	    Product: _astExpression3['default'],
	    Fraction: _astFraction2['default'],
	    Operator: _astOperator2['default'],
	    Identifier: _astIdentifier2['default'],
	    Literal: _astLiteral2['default'],
	    Equation: _astEquation2['default']
	};

	/*
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
	    factors: [ expressions ]

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
	    args: [ expressions ]
	};

	// no inheritance
	var func_def = {
	    type: 'FunctionDefinition',
	    params: [ variables ], // the signs of variables are ignored
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
	    children: [ expression ]
	};

	// vector < expression
	var vector = {
	    type: 'Vector',
	    components: [ expressions ]
	};

	// Parentheses
	// Any expression or subclass of expression can have an optional "parens" prop
	// with a boolean value which specifies whether or not parentheses should be
	// added.  In some cases, parenetheses must be added.  In all other cases, the
	// value of "parens" will be honored when rendering

	// TODO: matrices, system of equations
	*/

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var _bind = Function.prototype.bind;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _functify = __webpack_require__(3);

	var f = _interopRequireWildcard(_functify);

	var _listNode = __webpack_require__(90);

	var _listNode2 = _interopRequireDefault(_listNode);

	var _operator = __webpack_require__(91);

	var _operator2 = _interopRequireDefault(_operator);

	var Expression = (function (_ListNode) {
	    _inherits(Expression, _ListNode);

	    function Expression() {
	        _classCallCheck(this, Expression);

	        _get(Object.getPrototypeOf(Expression.prototype), 'constructor', this).call(this);
	        this.type = 'Expression';
	        this.append.apply(this, arguments);
	    }

	    _createClass(Expression, [{
	        key: 'add',
	        value: function add(node) {
	            this.append(new _operator2['default']('+'), node);
	            return this;
	        }
	    }, {
	        key: 'subtract',
	        value: function subtract(node) {
	            this.append(new _operator2['default']('-'), node);
	            return this;
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(node) {
	            return new Product(this, new _operator2['default']('*'), node);
	        }
	    }, {
	        key: 'divide',
	        value: function divide(node) {
	            return new Fraction(this, node);
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + _get(Object.getPrototypeOf(Expression.prototype), 'toString', this).call(this);
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new (_bind.apply(Expression, [null].concat(_toConsumableArray(f(this).map(function (x) {
	                return x.clone();
	            })))))();
	        }

	        // TODO have a validate method
	    }]);

	    return Expression;
	})(_listNode2['default']);

	exports['default'] = Expression;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = __webpack_require__(4)["default"];

	var _classCallCheck = __webpack_require__(8)["default"];

	var _defineProperty = __webpack_require__(9)["default"];

	var _slicedToArray = __webpack_require__(10)["default"];

	var _Symbol$iterator = __webpack_require__(49)["default"];

	var _regeneratorRuntime = __webpack_require__(51)["default"];

	var _getIterator = __webpack_require__(11)["default"];

	var _Set = __webpack_require__(83)["default"];

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var Functified = (function () {
	    function Functified(iterable) {
	        _classCallCheck(this, Functified);

	        // avoid re-wrapping iterables that have already been Functified
	        if (iterable.isFunctified) {
	            return iterable;
	        }
	        this.iterable = iterable;
	        this.isFunctified = true;
	    }

	    _createClass(Functified, [{
	        key: _Symbol$iterator,
	        value: _regeneratorRuntime.mark(function value() {
	            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value;

	            return _regeneratorRuntime.wrap(function value$(context$2$0) {
	                while (1) switch (context$2$0.prev = context$2$0.next) {
	                    case 0:
	                        _iteratorNormalCompletion = true;
	                        _didIteratorError = false;
	                        _iteratorError = undefined;
	                        context$2$0.prev = 3;
	                        _iterator = _getIterator(this.iterable);

	                    case 5:
	                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                            context$2$0.next = 12;
	                            break;
	                        }

	                        value = _step.value;
	                        context$2$0.next = 9;
	                        return value;

	                    case 9:
	                        _iteratorNormalCompletion = true;
	                        context$2$0.next = 5;
	                        break;

	                    case 12:
	                        context$2$0.next = 18;
	                        break;

	                    case 14:
	                        context$2$0.prev = 14;
	                        context$2$0.t0 = context$2$0["catch"](3);
	                        _didIteratorError = true;
	                        _iteratorError = context$2$0.t0;

	                    case 18:
	                        context$2$0.prev = 18;
	                        context$2$0.prev = 19;

	                        if (!_iteratorNormalCompletion && _iterator["return"]) {
	                            _iterator["return"]();
	                        }

	                    case 21:
	                        context$2$0.prev = 21;

	                        if (!_didIteratorError) {
	                            context$2$0.next = 24;
	                            break;
	                        }

	                        throw _iteratorError;

	                    case 24:
	                        return context$2$0.finish(21);

	                    case 25:
	                        return context$2$0.finish(18);

	                    case 26:
	                    case "end":
	                        return context$2$0.stop();
	                }
	            }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
	        })

	        // fn(iterable) -> generator function
	    }, {
	        key: "custom",
	        value: function custom(fn) {
	            return Functified.fromGenerator(fn(this.iterable));
	        }

	        // alias dedupe, unique
	    }, {
	        key: "distinct",
	        value: function distinct() {
	            var iterable = this.iterable;
	            var memory = new _Set();
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            _iteratorNormalCompletion2 = true;
	                            _didIteratorError2 = false;
	                            _iteratorError2 = undefined;
	                            context$3$0.prev = 3;
	                            _iterator2 = _getIterator(iterable);

	                        case 5:
	                            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	                                context$3$0.next = 14;
	                                break;
	                            }

	                            value = _step2.value;

	                            if (memory.has(value)) {
	                                context$3$0.next = 11;
	                                break;
	                            }

	                            memory.add(value);
	                            context$3$0.next = 11;
	                            return value;

	                        case 11:
	                            _iteratorNormalCompletion2 = true;
	                            context$3$0.next = 5;
	                            break;

	                        case 14:
	                            context$3$0.next = 20;
	                            break;

	                        case 16:
	                            context$3$0.prev = 16;
	                            context$3$0.t0 = context$3$0["catch"](3);
	                            _didIteratorError2 = true;
	                            _iteratorError2 = context$3$0.t0;

	                        case 20:
	                            context$3$0.prev = 20;
	                            context$3$0.prev = 21;

	                            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	                                _iterator2["return"]();
	                            }

	                        case 23:
	                            context$3$0.prev = 23;

	                            if (!_didIteratorError2) {
	                                context$3$0.next = 26;
	                                break;
	                            }

	                            throw _iteratorError2;

	                        case 26:
	                            return context$3$0.finish(23);

	                        case 27:
	                            return context$3$0.finish(20);

	                        case 28:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[3, 16, 20, 28], [21,, 23, 27]]);
	            }));
	        }
	    }, {
	        key: "filter",
	        value: function filter(callback) {
	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            _iteratorNormalCompletion3 = true;
	                            _didIteratorError3 = false;
	                            _iteratorError3 = undefined;
	                            context$3$0.prev = 3;
	                            _iterator3 = _getIterator(iterable);

	                        case 5:
	                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	                                context$3$0.next = 13;
	                                break;
	                            }

	                            value = _step3.value;

	                            if (!callback(value)) {
	                                context$3$0.next = 10;
	                                break;
	                            }

	                            context$3$0.next = 10;
	                            return value;

	                        case 10:
	                            _iteratorNormalCompletion3 = true;
	                            context$3$0.next = 5;
	                            break;

	                        case 13:
	                            context$3$0.next = 19;
	                            break;

	                        case 15:
	                            context$3$0.prev = 15;
	                            context$3$0.t0 = context$3$0["catch"](3);
	                            _didIteratorError3 = true;
	                            _iteratorError3 = context$3$0.t0;

	                        case 19:
	                            context$3$0.prev = 19;
	                            context$3$0.prev = 20;

	                            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
	                                _iterator3["return"]();
	                            }

	                        case 22:
	                            context$3$0.prev = 22;

	                            if (!_didIteratorError3) {
	                                context$3$0.next = 25;
	                                break;
	                            }

	                            throw _iteratorError3;

	                        case 25:
	                            return context$3$0.finish(22);

	                        case 26:
	                            return context$3$0.finish(19);

	                        case 27:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[3, 15, 19, 27], [20,, 22, 26]]);
	            }));
	        }
	    }, {
	        key: "flatten",
	        value: function flatten() {
	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            _iteratorNormalCompletion4 = true;
	                            _didIteratorError4 = false;
	                            _iteratorError4 = undefined;
	                            context$3$0.prev = 3;
	                            _iterator4 = _getIterator(iterable);

	                        case 5:
	                            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
	                                context$3$0.next = 16;
	                                break;
	                            }

	                            value = _step4.value;

	                            if (!value[_Symbol$iterator]) {
	                                context$3$0.next = 11;
	                                break;
	                            }

	                            return context$3$0.delegateYield(functify(value).flatten(), "t0", 9);

	                        case 9:
	                            context$3$0.next = 13;
	                            break;

	                        case 11:
	                            context$3$0.next = 13;
	                            return value;

	                        case 13:
	                            _iteratorNormalCompletion4 = true;
	                            context$3$0.next = 5;
	                            break;

	                        case 16:
	                            context$3$0.next = 22;
	                            break;

	                        case 18:
	                            context$3$0.prev = 18;
	                            context$3$0.t1 = context$3$0["catch"](3);
	                            _didIteratorError4 = true;
	                            _iteratorError4 = context$3$0.t1;

	                        case 22:
	                            context$3$0.prev = 22;
	                            context$3$0.prev = 23;

	                            if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
	                                _iterator4["return"]();
	                            }

	                        case 25:
	                            context$3$0.prev = 25;

	                            if (!_didIteratorError4) {
	                                context$3$0.next = 28;
	                                break;
	                            }

	                            throw _iteratorError4;

	                        case 28:
	                            return context$3$0.finish(25);

	                        case 29:
	                            return context$3$0.finish(22);

	                        case 30:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[3, 18, 22, 30], [23,, 25, 29]]);
	            }));
	        }
	    }, {
	        key: "groupBy",
	        value: function groupBy() {
	            var _this = this;

	            for (var _len = arguments.length, predicates = Array(_len), _key = 0; _key < _len; _key++) {
	                predicates[_key] = arguments[_key];
	            }

	            return functify(predicates.map(function (fn) {
	                return _this.filter(fn);
	            }));
	        }
	    }, {
	        key: "groupByMap",
	        value: function groupByMap(map) {
	            var _this2 = this;

	            return functify(map).map(function (_ref) {
	                var _ref2 = _slicedToArray(_ref, 2);

	                var name = _ref2[0];
	                var fn = _ref2[1];
	                return [name, _this2.filter(fn)];
	            });
	        }
	    }, {
	        key: "repeat",
	        value: function repeat() {
	            var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var i, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            i = 0;

	                        case 1:
	                            if (!(i++ < n)) {
	                                context$3$0.next = 30;
	                                break;
	                            }

	                            _iteratorNormalCompletion5 = true;
	                            _didIteratorError5 = false;
	                            _iteratorError5 = undefined;
	                            context$3$0.prev = 5;
	                            _iterator5 = _getIterator(iterable);

	                        case 7:
	                            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
	                                context$3$0.next = 14;
	                                break;
	                            }

	                            value = _step5.value;
	                            context$3$0.next = 11;
	                            return value;

	                        case 11:
	                            _iteratorNormalCompletion5 = true;
	                            context$3$0.next = 7;
	                            break;

	                        case 14:
	                            context$3$0.next = 20;
	                            break;

	                        case 16:
	                            context$3$0.prev = 16;
	                            context$3$0.t0 = context$3$0["catch"](5);
	                            _didIteratorError5 = true;
	                            _iteratorError5 = context$3$0.t0;

	                        case 20:
	                            context$3$0.prev = 20;
	                            context$3$0.prev = 21;

	                            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
	                                _iterator5["return"]();
	                            }

	                        case 23:
	                            context$3$0.prev = 23;

	                            if (!_didIteratorError5) {
	                                context$3$0.next = 26;
	                                break;
	                            }

	                            throw _iteratorError5;

	                        case 26:
	                            return context$3$0.finish(23);

	                        case 27:
	                            return context$3$0.finish(20);

	                        case 28:
	                            context$3$0.next = 1;
	                            break;

	                        case 30:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[5, 16, 20, 28], [21,, 23, 27]]);
	            }));
	        }

	        // alias for repeat
	    }, {
	        key: "loop",
	        value: function loop() {
	            var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	            console.warn("deprecating loop(n), use repeat(n) instead");
	            return this.repeat(n);
	        }
	    }, {
	        key: "map",
	        value: function map(callback) {
	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            _iteratorNormalCompletion6 = true;
	                            _didIteratorError6 = false;
	                            _iteratorError6 = undefined;
	                            context$3$0.prev = 3;
	                            _iterator6 = _getIterator(iterable);

	                        case 5:
	                            if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
	                                context$3$0.next = 12;
	                                break;
	                            }

	                            value = _step6.value;
	                            context$3$0.next = 9;
	                            return callback(value);

	                        case 9:
	                            _iteratorNormalCompletion6 = true;
	                            context$3$0.next = 5;
	                            break;

	                        case 12:
	                            context$3$0.next = 18;
	                            break;

	                        case 14:
	                            context$3$0.prev = 14;
	                            context$3$0.t0 = context$3$0["catch"](3);
	                            _didIteratorError6 = true;
	                            _iteratorError6 = context$3$0.t0;

	                        case 18:
	                            context$3$0.prev = 18;
	                            context$3$0.prev = 19;

	                            if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
	                                _iterator6["return"]();
	                            }

	                        case 21:
	                            context$3$0.prev = 21;

	                            if (!_didIteratorError6) {
	                                context$3$0.next = 24;
	                                break;
	                            }

	                            throw _iteratorError6;

	                        case 24:
	                            return context$3$0.finish(21);

	                        case 25:
	                            return context$3$0.finish(18);

	                        case 26:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[3, 14, 18, 26], [19,, 21, 25]]);
	            }));
	        }
	    }, {
	        key: "skip",
	        value: function skip(n) {
	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var i, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            i = 0;
	                            _iteratorNormalCompletion7 = true;
	                            _didIteratorError7 = false;
	                            _iteratorError7 = undefined;
	                            context$3$0.prev = 4;
	                            _iterator7 = _getIterator(iterable);

	                        case 6:
	                            if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
	                                context$3$0.next = 17;
	                                break;
	                            }

	                            value = _step7.value;

	                            if (!(i < n)) {
	                                context$3$0.next = 12;
	                                break;
	                            }

	                            i++;
	                            context$3$0.next = 14;
	                            break;

	                        case 12:
	                            context$3$0.next = 14;
	                            return value;

	                        case 14:
	                            _iteratorNormalCompletion7 = true;
	                            context$3$0.next = 6;
	                            break;

	                        case 17:
	                            context$3$0.next = 23;
	                            break;

	                        case 19:
	                            context$3$0.prev = 19;
	                            context$3$0.t0 = context$3$0["catch"](4);
	                            _didIteratorError7 = true;
	                            _iteratorError7 = context$3$0.t0;

	                        case 23:
	                            context$3$0.prev = 23;
	                            context$3$0.prev = 24;

	                            if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
	                                _iterator7["return"]();
	                            }

	                        case 26:
	                            context$3$0.prev = 26;

	                            if (!_didIteratorError7) {
	                                context$3$0.next = 29;
	                                break;
	                            }

	                            throw _iteratorError7;

	                        case 29:
	                            return context$3$0.finish(26);

	                        case 30:
	                            return context$3$0.finish(23);

	                        case 31:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[4, 19, 23, 31], [24,, 26, 30]]);
	            }));
	        }
	    }, {
	        key: "skipWhile",
	        value: function skipWhile(predicate) {
	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var skip, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            skip = true;
	                            _iteratorNormalCompletion8 = true;
	                            _didIteratorError8 = false;
	                            _iteratorError8 = undefined;
	                            context$3$0.prev = 4;
	                            _iterator8 = _getIterator(iterable);

	                        case 6:
	                            if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
	                                context$3$0.next = 15;
	                                break;
	                            }

	                            value = _step8.value;

	                            if (!predicate(value)) {
	                                skip = false;
	                            }

	                            if (skip) {
	                                context$3$0.next = 12;
	                                break;
	                            }

	                            context$3$0.next = 12;
	                            return value;

	                        case 12:
	                            _iteratorNormalCompletion8 = true;
	                            context$3$0.next = 6;
	                            break;

	                        case 15:
	                            context$3$0.next = 21;
	                            break;

	                        case 17:
	                            context$3$0.prev = 17;
	                            context$3$0.t0 = context$3$0["catch"](4);
	                            _didIteratorError8 = true;
	                            _iteratorError8 = context$3$0.t0;

	                        case 21:
	                            context$3$0.prev = 21;
	                            context$3$0.prev = 22;

	                            if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
	                                _iterator8["return"]();
	                            }

	                        case 24:
	                            context$3$0.prev = 24;

	                            if (!_didIteratorError8) {
	                                context$3$0.next = 27;
	                                break;
	                            }

	                            throw _iteratorError8;

	                        case 27:
	                            return context$3$0.finish(24);

	                        case 28:
	                            return context$3$0.finish(21);

	                        case 29:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[4, 17, 21, 29], [22,, 24, 28]]);
	            }));
	        }
	    }, {
	        key: "take",
	        value: function take(n) {
	            // using an explicit iterator supports pausable iteratables
	            var iterator = _getIterator(this.iterable);
	            var self = this;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var i, result;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            i = 0;

	                            if (!(self.hasOwnProperty("startValue") && self.isPausable)) {
	                                context$3$0.next = 5;
	                                break;
	                            }

	                            context$3$0.next = 4;
	                            return self.startValue;

	                        case 4:
	                            i++;

	                        case 5:
	                            if (!(i < n)) {
	                                context$3$0.next = 16;
	                                break;
	                            }

	                            result = iterator.next();

	                            if (!result.done) {
	                                context$3$0.next = 11;
	                                break;
	                            }

	                            return context$3$0.abrupt("break", 16);

	                        case 11:
	                            context$3$0.next = 13;
	                            return result.value;

	                        case 13:
	                            i++;

	                        case 14:
	                            context$3$0.next = 5;
	                            break;

	                        case 16:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	        }
	    }, {
	        key: "takeUntil",
	        value: function takeUntil(predicate) {
	            var iterator = _getIterator(this.iterable);
	            var self = this;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var result;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            if (!(self.hasOwnProperty("startValue") && self.isPausable)) {
	                                context$3$0.next = 3;
	                                break;
	                            }

	                            context$3$0.next = 3;
	                            return self.startValue;

	                        case 3:
	                            if (false) {
	                                context$3$0.next = 18;
	                                break;
	                            }

	                            result = iterator.next();

	                            if (!result.done) {
	                                context$3$0.next = 9;
	                                break;
	                            }

	                            return context$3$0.abrupt("break", 18);

	                        case 9:
	                            if (!predicate(result.value)) {
	                                context$3$0.next = 14;
	                                break;
	                            }

	                            // save the value so we can yield if takeUntil is called again
	                            self.startValue = result.value;
	                            return context$3$0.abrupt("break", 18);

	                        case 14:
	                            context$3$0.next = 16;
	                            return result.value;

	                        case 16:
	                            context$3$0.next = 3;
	                            break;

	                        case 18:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	        }
	    }, {
	        key: "enumerate",
	        value: function enumerate() {
	            var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	            var iterable = this.iterable;
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var i, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, value;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            i = start;
	                            _iteratorNormalCompletion9 = true;
	                            _didIteratorError9 = false;
	                            _iteratorError9 = undefined;
	                            context$3$0.prev = 4;
	                            _iterator9 = _getIterator(iterable);

	                        case 6:
	                            if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
	                                context$3$0.next = 13;
	                                break;
	                            }

	                            value = _step9.value;
	                            context$3$0.next = 10;
	                            return [i++, value];

	                        case 10:
	                            _iteratorNormalCompletion9 = true;
	                            context$3$0.next = 6;
	                            break;

	                        case 13:
	                            context$3$0.next = 19;
	                            break;

	                        case 15:
	                            context$3$0.prev = 15;
	                            context$3$0.t0 = context$3$0["catch"](4);
	                            _didIteratorError9 = true;
	                            _iteratorError9 = context$3$0.t0;

	                        case 19:
	                            context$3$0.prev = 19;
	                            context$3$0.prev = 20;

	                            if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
	                                _iterator9["return"]();
	                            }

	                        case 22:
	                            context$3$0.prev = 22;

	                            if (!_didIteratorError9) {
	                                context$3$0.next = 25;
	                                break;
	                            }

	                            throw _iteratorError9;

	                        case 25:
	                            return context$3$0.finish(22);

	                        case 26:
	                            return context$3$0.finish(19);

	                        case 27:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[4, 15, 19, 27], [20,, 22, 26]]);
	            }));
	        }
	    }, {
	        key: "zip",
	        value: function zip() {
	            return Functified.zip(this.iterable);
	        }

	        // reducing functions
	    }, {
	        key: "every",
	        value: function every(callback) {
	            var _iteratorNormalCompletion10 = true;
	            var _didIteratorError10 = false;
	            var _iteratorError10 = undefined;

	            try {
	                for (var _iterator10 = _getIterator(this.iterable), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                    var value = _step10.value;

	                    if (!callback(value)) {
	                        return false;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError10 = true;
	                _iteratorError10 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
	                        _iterator10["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError10) {
	                        throw _iteratorError10;
	                    }
	                }
	            }

	            return true;
	        }
	    }, {
	        key: "reduce",
	        value: function reduce(callback, initialValue) {
	            var accum = initialValue;
	            var iterator = _getIterator(this.iterable);

	            if (accum === undefined) {
	                var result = iterator.next();
	                if (result.done) {
	                    throw "not enough values to reduce";
	                } else {
	                    accum = result.value;
	                }
	            }

	            while (true) {
	                var result = iterator.next();
	                if (result.done) {
	                    break;
	                } else {
	                    accum = callback(accum, result.value);
	                }
	            }

	            return accum;
	        }
	    }, {
	        key: "some",
	        value: function some(callback) {
	            var _iteratorNormalCompletion11 = true;
	            var _didIteratorError11 = false;
	            var _iteratorError11 = undefined;

	            try {
	                for (var _iterator11 = _getIterator(this.iterable), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
	                    var value = _step11.value;

	                    if (callback(value)) {
	                        return true;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError11 = true;
	                _iteratorError11 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
	                        _iterator11["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError11) {
	                        throw _iteratorError11;
	                    }
	                }
	            }

	            return false;
	        }
	    }, {
	        key: "entries",
	        value: function entries() {
	            if (this.iterable.entries) {
	                return new Functified(this.iterable.entries());
	            } else {
	                throw "doesn't have entries";
	            }
	        }
	    }, {
	        key: "keys",
	        value: function keys() {
	            if (this.iterable.keys) {
	                return new Functified(this.iterable.keys());
	            } else {
	                throw "doesn't have keys";
	            }
	        }
	    }, {
	        key: "values",
	        value: function values() {
	            if (this.iterable.values) {
	                return new Functified(this.iterable.values());
	            } else {
	                throw "doesn't have values";
	            }
	        }
	    }, {
	        key: "toArray",
	        value: function toArray() {
	            var result = [];
	            var _iteratorNormalCompletion12 = true;
	            var _didIteratorError12 = false;
	            var _iteratorError12 = undefined;

	            try {
	                for (var _iterator12 = _getIterator(this.iterable), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
	                    var value = _step12.value;

	                    result.push(value);
	                }
	            } catch (err) {
	                _didIteratorError12 = true;
	                _iteratorError12 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
	                        _iterator12["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError12) {
	                        throw _iteratorError12;
	                    }
	                }
	            }

	            return result;
	        }
	    }, {
	        key: "toPausable",
	        value: function toPausable() {
	            var iterator = _getIterator(this.iterable);
	            var functified = Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var result;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            if (false) {
	                                context$3$0.next = 10;
	                                break;
	                            }

	                            result = iterator.next();

	                            if (!result.done) {
	                                context$3$0.next = 6;
	                                break;
	                            }

	                            return context$3$0.abrupt("break", 10);

	                        case 6:
	                            context$3$0.next = 8;
	                            return result.value;

	                        case 8:
	                            context$3$0.next = 0;
	                            break;

	                        case 10:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	            functified.isPausable = true;
	            return functified;
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            var i = 0;
	            var result = "[";
	            result += this.reduce(function (str, n) {
	                return str + (i++ > 0 ? ", " + n : "" + n);
	            }, "");
	            result += "]";
	            return result;
	        }

	        // static methods
	    }], [{
	        key: "fromGenerator",
	        value: function fromGenerator(generator) {
	            return functify(_defineProperty({}, _Symbol$iterator, generator));
	        }
	    }, {
	        key: "fromObject",
	        value: function fromObject(obj) {
	            var _functify2;

	            return functify((_functify2 = {}, _defineProperty(_functify2, _Symbol$iterator, _regeneratorRuntime.mark(function callee$2$0() {
	                var key;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            context$3$0.t0 = _regeneratorRuntime.keys(obj);

	                        case 1:
	                            if ((context$3$0.t1 = context$3$0.t0()).done) {
	                                context$3$0.next = 8;
	                                break;
	                            }

	                            key = context$3$0.t1.value;

	                            if (!obj.hasOwnProperty(key)) {
	                                context$3$0.next = 6;
	                                break;
	                            }

	                            context$3$0.next = 6;
	                            return [key, obj[key]];

	                        case 6:
	                            context$3$0.next = 1;
	                            break;

	                        case 8:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            })), _defineProperty(_functify2, "entries", function entries() {
	                return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$3$0() {
	                    var key;
	                    return _regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
	                        while (1) switch (context$4$0.prev = context$4$0.next) {
	                            case 0:
	                                context$4$0.t0 = _regeneratorRuntime.keys(obj);

	                            case 1:
	                                if ((context$4$0.t1 = context$4$0.t0()).done) {
	                                    context$4$0.next = 8;
	                                    break;
	                                }

	                                key = context$4$0.t1.value;

	                                if (!obj.hasOwnProperty(key)) {
	                                    context$4$0.next = 6;
	                                    break;
	                                }

	                                context$4$0.next = 6;
	                                return [key, obj[key]];

	                            case 6:
	                                context$4$0.next = 1;
	                                break;

	                            case 8:
	                            case "end":
	                                return context$4$0.stop();
	                        }
	                    }, callee$3$0, this);
	                }));
	            }), _defineProperty(_functify2, "keys", function keys() {
	                return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$3$0() {
	                    var key;
	                    return _regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
	                        while (1) switch (context$4$0.prev = context$4$0.next) {
	                            case 0:
	                                context$4$0.t0 = _regeneratorRuntime.keys(obj);

	                            case 1:
	                                if ((context$4$0.t1 = context$4$0.t0()).done) {
	                                    context$4$0.next = 8;
	                                    break;
	                                }

	                                key = context$4$0.t1.value;

	                                if (!obj.hasOwnProperty(key)) {
	                                    context$4$0.next = 6;
	                                    break;
	                                }

	                                context$4$0.next = 6;
	                                return key;

	                            case 6:
	                                context$4$0.next = 1;
	                                break;

	                            case 8:
	                            case "end":
	                                return context$4$0.stop();
	                        }
	                    }, callee$3$0, this);
	                }));
	            }), _defineProperty(_functify2, "values", function values() {
	                return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$3$0() {
	                    var key;
	                    return _regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
	                        while (1) switch (context$4$0.prev = context$4$0.next) {
	                            case 0:
	                                context$4$0.t0 = _regeneratorRuntime.keys(obj);

	                            case 1:
	                                if ((context$4$0.t1 = context$4$0.t0()).done) {
	                                    context$4$0.next = 8;
	                                    break;
	                                }

	                                key = context$4$0.t1.value;

	                                if (!obj.hasOwnProperty(key)) {
	                                    context$4$0.next = 6;
	                                    break;
	                                }

	                                context$4$0.next = 6;
	                                return obj[key];

	                            case 6:
	                                context$4$0.next = 1;
	                                break;

	                            case 8:
	                            case "end":
	                                return context$4$0.stop();
	                        }
	                    }, callee$3$0, this);
	                }));
	            }), _functify2));
	        }
	    }, {
	        key: "range",
	        value: function range(start, stop) {
	            var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

	            if (arguments.length === 1) {
	                stop = start;
	                start = 0;
	            }
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var i;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            i = start;

	                            if (!(step > 0)) {
	                                context$3$0.next = 10;
	                                break;
	                            }

	                        case 2:
	                            if (!(i < stop)) {
	                                context$3$0.next = 8;
	                                break;
	                            }

	                            context$3$0.next = 5;
	                            return i;

	                        case 5:
	                            i += step;
	                            context$3$0.next = 2;
	                            break;

	                        case 8:
	                            context$3$0.next = 20;
	                            break;

	                        case 10:
	                            if (!(step < 0)) {
	                                context$3$0.next = 19;
	                                break;
	                            }

	                        case 11:
	                            if (!(i > stop)) {
	                                context$3$0.next = 17;
	                                break;
	                            }

	                            context$3$0.next = 14;
	                            return i;

	                        case 14:
	                            i += step;
	                            context$3$0.next = 11;
	                            break;

	                        case 17:
	                            context$3$0.next = 20;
	                            break;

	                        case 19:
	                            throw "step should not equal 0";

	                        case 20:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	        }
	    }, {
	        key: "zip",
	        value: function zip(iterables) {
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var iterators, vector, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, iterator, result;

	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            iterators = iterables.map(function (iterable) {
	                                if (iterable[_Symbol$iterator]) {
	                                    return _getIterator(iterable);
	                                } else {
	                                    throw "can't zip a non-iterable";
	                                }
	                            });

	                        case 1:
	                            if (false) {
	                                context$3$0.next = 37;
	                                break;
	                            }

	                            vector = [];
	                            _iteratorNormalCompletion13 = true;
	                            _didIteratorError13 = false;
	                            _iteratorError13 = undefined;
	                            context$3$0.prev = 6;
	                            _iterator13 = _getIterator(iterators);

	                        case 8:
	                            if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
	                                context$3$0.next = 19;
	                                break;
	                            }

	                            iterator = _step13.value;
	                            result = iterator.next();

	                            if (!result.done) {
	                                context$3$0.next = 15;
	                                break;
	                            }

	                            return context$3$0.abrupt("return");

	                        case 15:
	                            vector.push(result.value);

	                        case 16:
	                            _iteratorNormalCompletion13 = true;
	                            context$3$0.next = 8;
	                            break;

	                        case 19:
	                            context$3$0.next = 25;
	                            break;

	                        case 21:
	                            context$3$0.prev = 21;
	                            context$3$0.t0 = context$3$0["catch"](6);
	                            _didIteratorError13 = true;
	                            _iteratorError13 = context$3$0.t0;

	                        case 25:
	                            context$3$0.prev = 25;
	                            context$3$0.prev = 26;

	                            if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
	                                _iterator13["return"]();
	                            }

	                        case 28:
	                            context$3$0.prev = 28;

	                            if (!_didIteratorError13) {
	                                context$3$0.next = 31;
	                                break;
	                            }

	                            throw _iteratorError13;

	                        case 31:
	                            return context$3$0.finish(28);

	                        case 32:
	                            return context$3$0.finish(25);

	                        case 33:
	                            context$3$0.next = 35;
	                            return vector;

	                        case 35:
	                            context$3$0.next = 1;
	                            break;

	                        case 37:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this, [[6, 21, 25, 33], [26,, 28, 32]]);
	            }));
	        }
	    }, {
	        key: "keys",
	        value: function keys(obj) {
	            console.warn("functify.keys is deprecated and will be removed in 0.3.0");
	            console.warn("use functify(obj).keys() instead");
	            if (!(obj instanceof Object)) {
	                throw "can't get keys for a non-object";
	            }
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var key;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            context$3$0.t0 = _regeneratorRuntime.keys(obj);

	                        case 1:
	                            if ((context$3$0.t1 = context$3$0.t0()).done) {
	                                context$3$0.next = 8;
	                                break;
	                            }

	                            key = context$3$0.t1.value;

	                            if (!obj.hasOwnProperty(key)) {
	                                context$3$0.next = 6;
	                                break;
	                            }

	                            context$3$0.next = 6;
	                            return key;

	                        case 6:
	                            context$3$0.next = 1;
	                            break;

	                        case 8:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	        }
	    }, {
	        key: "values",
	        value: function values(obj) {
	            console.log("functify.values is deprecated and will be removed in 0.3.0");
	            console.warn("use functify(obj).values() instead");
	            return Functified.keys(obj).map(function (key) {
	                return obj[key];
	            });
	        }
	    }, {
	        key: "entries",
	        value: function entries(obj) {
	            console.log("functify.entries is deprecated and will be removed in 0.3.0");
	            console.warn("use functify(obj).entries() instead");
	            if (!(obj instanceof Object)) {
	                throw "can't get keys for a non-object";
	            }
	            return Functified.fromGenerator(_regeneratorRuntime.mark(function callee$2$0() {
	                var key;
	                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
	                    while (1) switch (context$3$0.prev = context$3$0.next) {
	                        case 0:
	                            context$3$0.t0 = _regeneratorRuntime.keys(obj);

	                        case 1:
	                            if ((context$3$0.t1 = context$3$0.t0()).done) {
	                                context$3$0.next = 8;
	                                break;
	                            }

	                            key = context$3$0.t1.value;

	                            if (!obj.hasOwnProperty(key)) {
	                                context$3$0.next = 6;
	                                break;
	                            }

	                            context$3$0.next = 6;
	                            return [key, obj[key]];

	                        case 6:
	                            context$3$0.next = 1;
	                            break;

	                        case 8:
	                        case "end":
	                            return context$3$0.stop();
	                    }
	                }, callee$2$0, this);
	            }));
	        }
	    }]);

	    return Functified;
	})();

	function functify(iterable) {
	    if (!iterable[_Symbol$iterator]) {
	        return Functified.fromObject(iterable);
	    } else {
	        return new Functified(iterable);
	    }
	}

	functify.fromGenerator = Functified.fromGenerator;
	functify.range = Functified.range;
	functify.zip = Functified.zip;
	functify.keys = Functified.keys;
	functify.values = Functified.values;
	functify.entries = Functified.entries;

	exports["default"] = functify;
	module.exports = exports["default"];
	// finished


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(5)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(5)["default"];

	exports["default"] = function (obj, key, value) {
	  if (key in obj) {
	    _Object$defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	exports.__esModule = true;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator = __webpack_require__(11)["default"];

	var _isIterable = __webpack_require__(46)["default"];

	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(12), __esModule: true };

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(13);
	__webpack_require__(38);
	module.exports = __webpack_require__(41);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14);
	var Iterators = __webpack_require__(17);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var setUnscope = __webpack_require__(15)
	  , step       = __webpack_require__(16)
	  , Iterators  = __webpack_require__(17)
	  , toIObject  = __webpack_require__(18);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(22)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(19)
	  , defined = __webpack_require__(21);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	var cof = __webpack_require__(20);
	module.exports = 0 in Object('z') ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY         = __webpack_require__(23)
	  , $def            = __webpack_require__(24)
	  , $redef          = __webpack_require__(27)
	  , hide            = __webpack_require__(28)
	  , has             = __webpack_require__(32)
	  , SYMBOL_ITERATOR = __webpack_require__(33)('iterator')
	  , Iterators       = __webpack_require__(17)
	  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values';
	var returnThis = function(){ return this; };
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  __webpack_require__(36)(Constructor, NAME, next);
	  var createMethod = function(kind){
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = __webpack_require__(7).getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    __webpack_require__(37)(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
	  }
	  // Define iterator
	  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(25)
	  , core      = __webpack_require__(26)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 25 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var UNDEFINED = 'undefined';
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math
	  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 26 */
/***/ function(module, exports) {

	var core = module.exports = {};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(7)
	  , createDesc = __webpack_require__(29);
	module.exports = __webpack_require__(30) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(31)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(34)('wks')
	  , Symbol = __webpack_require__(25).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || __webpack_require__(35))('Symbol.' + name));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(25)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(7)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(28)(IteratorPrototype, __webpack_require__(33)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: __webpack_require__(29)(1,next)});
	  __webpack_require__(37)(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var has  = __webpack_require__(32)
	  , hide = __webpack_require__(28)
	  , TAG  = __webpack_require__(33)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(39)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(22)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var toInteger = __webpack_require__(40)
	  , defined   = __webpack_require__(21);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(42)
	  , get      = __webpack_require__(44);
	module.exports = __webpack_require__(26).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(43);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	// http://jsperf.com/core-js-isobject
	module.exports = function(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(45)
	  , ITERATOR  = __webpack_require__(33)('iterator')
	  , Iterators = __webpack_require__(17);
	module.exports = __webpack_require__(26).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(20)
	  , TAG = __webpack_require__(33)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(47), __esModule: true };

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(13);
	__webpack_require__(38);
	module.exports = __webpack_require__(48);

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(45)
	  , ITERATOR  = __webpack_require__(33)('iterator')
	  , Iterators = __webpack_require__(17);
	module.exports = __webpack_require__(26).isIterable = function(it){
	  var O = Object(it);
	  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(38);
	__webpack_require__(13);
	module.exports = __webpack_require__(33)('iterator');

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g =
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this;

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	module.exports = __webpack_require__(52);

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	module.exports = { "default": module.exports, __esModule: true };

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	"use strict";

	var _Symbol = __webpack_require__(54)["default"];

	var _Symbol$iterator = __webpack_require__(49)["default"];

	var _Object$create = __webpack_require__(60)["default"];

	var _Promise = __webpack_require__(62)["default"];

	!(function (global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol = typeof _Symbol === "function" && _Symbol$iterator || "@@iterator";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = _Object$create((outerFn || Generator).prototype);

	    generator._invoke = makeInvokeMethod(innerFn, self || null, new Context(tryLocsList || []));

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction ||
	    // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  runtime.mark = function (genFun) {
	    genFun.__proto__ = GeneratorFunctionPrototype;
	    genFun.prototype = _Object$create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function (arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument ? _Promise.resolve(value.arg).then(invokeNext, invokeThrow) : _Promise.resolve(value).then(function (unwrapped) {
	        // When a yielded Promise is resolved, its final value becomes
	        // the .value of the Promise<{value,done}> result for the
	        // current iteration. If the Promise is rejected, however, the
	        // result for this iteration will be rejected with the same
	        // reason. Note that rejections of yielded Promises are not
	        // thrown back into the generator function, as is the case
	        // when an awaited Promise is rejected. This difference in
	        // behavior between yield and await is important, because it
	        // allows the consumer to decide what to do with the yielded
	        // rejection (swallow it and continue, manually .throw it back
	        // into the generator, abandon iteration, whatever). With
	        // await, by contrast, there is no opportunity to examine the
	        // rejection reason outside the generator function, so the
	        // only option is to throw it from the await expression, and
	        // let the generator function handle the exception.
	        result.value = unwrapped;
	        return result;
	      });
	    }

	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      var enqueueResult =
	      // If enqueue has been called before, then we want to wait until
	      // all previous Promises have been resolved before calling invoke,
	      // so that results are always delivered in the correct order. If
	      // enqueue has not been called before, then it is important to
	      // call invoke immediately, without waiting on a callback to fire,
	      // so that the async generator function has the opportunity to do
	      // any necessary setup in a predictable way. This predictability
	      // is why the Promise constructor synchronously invokes its
	      // executor callback, and why async functions synchronously
	      // execute code before the first await. Since we implement simple
	      // async functions in terms of async generators, it is especially
	      // important to get this right, even though it requires care.
	      previousPromise ? previousPromise.then(function () {
	        return invoke(method, arg);
	      }) : new _Promise(function (resolve) {
	        resolve(invoke(method, arg));
	      });

	      // Avoid propagating enqueueResult failures to Promises returned by
	      // later invocations of the iterator.
	      previousPromise = enqueueResult["catch"](function (ignored) {});

	      return enqueueResult;
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

	    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function (object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1,
	            next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function reset(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function stop() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function dispatchException(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function complete(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	})(
	// Among the various tricks for obtaining a reference to the global
	// object, this seems to be the most reliable technique that does not
	// use indirect eval (which violates Content Security Policy).
	typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(53)))

/***/ },
/* 53 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(55), __esModule: true };

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(56);
	module.exports = __webpack_require__(26).Symbol;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(7)
	  , global         = __webpack_require__(25)
	  , has            = __webpack_require__(32)
	  , SUPPORT_DESC   = __webpack_require__(30)
	  , $def           = __webpack_require__(24)
	  , $redef         = __webpack_require__(27)
	  , shared         = __webpack_require__(34)
	  , setTag         = __webpack_require__(37)
	  , uid            = __webpack_require__(35)
	  , wks            = __webpack_require__(33)
	  , keyOf          = __webpack_require__(57)
	  , $names         = __webpack_require__(58)
	  , enumKeys       = __webpack_require__(59)
	  , isObject       = __webpack_require__(43)
	  , anObject       = __webpack_require__(42)
	  , toIObject      = __webpack_require__(18)
	  , createDesc     = __webpack_require__(29)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	var setSymbolDesc = SUPPORT_DESC ? function(){ // fallback for old Android
	  try {
	    return _create(setDesc({}, HIDDEN, {
	      get: function(){
	        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
	      }
	    }))[HIDDEN] || setDesc;
	  } catch(e){
	    return function(it, key, D){
	      var protoDesc = getDesc(ObjectProto, key);
	      if(protoDesc)delete ObjectProto[key];
	      setDesc(it, key, D);
	      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	    };
	  }
	}() : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments[0]));
	  };
	  $redef($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(SUPPORT_DESC && !__webpack_require__(23)){
	    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	// MS Edge converts symbol values to JSON as {}
	// WebKit converts symbol values in objects to JSON as null
	if(!useNative || __webpack_require__(31)(function(){
	  return JSON.stringify([{a: $Symbol()}, [$Symbol()]]) != '[{},[null]]';
	}))$redef($Symbol.prototype, 'toJSON', function toJSON(){
	  if(useNative && isObject(this))return this;
	});

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	    'species,split,toPrimitive,toStringTag,unscopables'
	  ).split(','), function(it){
	    var sym = wks(it);
	    symbolStatics[it] = useNative ? sym : wrap(sym);
	  }
	);

	setter = true;

	$def($def.G + $def.W, {Symbol: $Symbol});

	$def($def.S, 'Symbol', symbolStatics);

	$def($def.S + $def.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setTag(global.JSON, 'JSON', true);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(7)
	  , toIObject = __webpack_require__(18);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toString  = {}.toString
	  , toIObject = __webpack_require__(18)
	  , getNames  = __webpack_require__(7).getNames;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(7);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(61), __esModule: true };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(64);
	__webpack_require__(38);
	__webpack_require__(13);
	__webpack_require__(65);
	module.exports = __webpack_require__(26).Promise;

/***/ },
/* 64 */
/***/ function(module, exports) {

	

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(7)
	  , LIBRARY    = __webpack_require__(23)
	  , global     = __webpack_require__(25)
	  , ctx        = __webpack_require__(66)
	  , classof    = __webpack_require__(45)
	  , $def       = __webpack_require__(24)
	  , isObject   = __webpack_require__(43)
	  , anObject   = __webpack_require__(42)
	  , aFunction  = __webpack_require__(67)
	  , strictNew  = __webpack_require__(68)
	  , forOf      = __webpack_require__(69)
	  , setProto   = __webpack_require__(73).set
	  , same       = __webpack_require__(74)
	  , species    = __webpack_require__(75)
	  , SPECIES    = __webpack_require__(33)('species')
	  , RECORD     = __webpack_require__(35)('record')
	  , asap       = __webpack_require__(76)
	  , PROMISE    = 'Promise'
	  , process    = global.process
	  , isNode     = classof(process) == 'process'
	  , P          = global[PROMISE]
	  , Wrapper;

	var testResolve = function(sub){
	  var test = new P(function(){});
	  if(sub)test.constructor = Object;
	  return P.resolve(test) === test;
	};

	var useNative = function(){
	  var works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = P && P.resolve && testResolve();
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
	    if(works && __webpack_require__(30)){
	      var thenableThenGotten = false;
	      P.resolve($.setDesc({}, 'then', {
	        get: function(){ thenableThenGotten = true; }
	      }));
	      works = thenableThenGotten;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();

	// helpers
	var isPromise = function(it){
	  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
	};
	var sameConstructor = function(a, b){
	  // library wrapper special case
	  if(LIBRARY && a === P && b === Wrapper)return true;
	  return same(a, b);
	};
	var getConstructor = function(C){
	  var S = anObject(C)[SPECIES];
	  return S != undefined ? S : C;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function(record, isReject){
	  if(record.n)return;
	  record.n = true;
	  var chain = record.c;
	  asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    var run = function(react){
	      var cb = ok ? react.ok : react.fail
	        , ret, then;
	      try {
	        if(cb){
	          if(!ok)record.h = true;
	          ret = cb === true ? value : cb(value);
	          if(ret === react.P){
	            react.rej(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(ret)){
	            then.call(ret, react.res, react.rej);
	          } else react.res(ret);
	        } else react.rej(value);
	      } catch(err){
	        react.rej(err);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	    record.n = false;
	    if(isReject)setTimeout(function(){
	      if(isUnhandled(record.p)){
	        if(isNode){
	          process.emit('unhandledRejection', value, record.p);
	        } else if(global.console && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      } record.a = undefined;
	    }, 1);
	  });
	};
	var isUnhandled = function(promise){
	  var record = promise[RECORD]
	    , chain  = record.a || record.c
	    , i      = 0
	    , react;
	  if(record.h)return false;
	  while(chain.length > i){
	    react = chain[i++];
	    if(react.fail || !isUnhandled(react.P))return false;
	  } return true;
	};
	var $reject = function(value){
	  var record = this;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  notify(record, true);
	};
	var $resolve = function(value){
	  var record = this
	    , then;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(then = isThenable(value)){
	      asap(function(){
	        var wrapper = {r: record, d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record, false);
	    }
	  } catch(e){
	    $reject.call({r: record, d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!useNative){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    aFunction(executor);
	    var record = {
	      p: strictNew(this, P, PROMISE),         // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false,                               // <- handled rejection
	      n: false                                // <- notify
	    };
	    this[RECORD] = record;
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(81)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var S = anObject(anObject(this).constructor)[SPECIES];
	      var react = {
	        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
	        fail: typeof onRejected == 'function'  ? onRejected  : false
	      };
	      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
	        react.res = aFunction(res);
	        react.rej = aFunction(rej);
	      });
	      var record = this[RECORD];
	      record.c.push(react);
	      if(record.a)record.a.push(react);
	      if(record.s)notify(record, false);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	// export
	$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
	__webpack_require__(37)(P, PROMISE);
	species(P);
	species(Wrapper = __webpack_require__(26)[PROMISE]);

	// statics
	$def($def.S + $def.F * !useNative, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    return new this(function(res, rej){ rej(r); });
	  }
	});
	$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    return isPromise(x) && sameConstructor(x.constructor, this)
	      ? x : new this(function(res){ res(x); });
	  }
	});
	$def($def.S + $def.F * !(useNative && __webpack_require__(82)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C      = getConstructor(this)
	      , values = [];
	    return new C(function(res, rej){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        C.resolve(promise).then(function(value){
	          results[index] = value;
	          --remaining || res(results);
	        }, rej);
	      });
	      else res(results);
	    });
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C = getConstructor(this);
	    return new C(function(res, rej){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(res, rej);
	      });
	    });
	  }
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(67);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(66)
	  , call        = __webpack_require__(70)
	  , isArrayIter = __webpack_require__(71)
	  , anObject    = __webpack_require__(42)
	  , toLength    = __webpack_require__(72)
	  , getIterFn   = __webpack_require__(44);
	module.exports = function(iterable, entries, fn, that){
	  var iterFn = getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(42);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(17)
	  , ITERATOR  = __webpack_require__(33)('iterator');
	module.exports = function(it){
	  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(40)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(7).getDesc
	  , isObject = __webpack_require__(43)
	  , anObject = __webpack_require__(42);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	    ? function(buggy, set){
	        try {
	          set = __webpack_require__(66)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	          set({}, []);
	        } catch(e){ buggy = true; }
	        return function setPrototypeOf(O, proto){
	          check(O, proto);
	          if(buggy)O.__proto__ = proto;
	          else set(O, proto);
	          return O;
	        };
	      }()
	    : undefined),
	  check: check
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $       = __webpack_require__(7)
	  , SPECIES = __webpack_require__(33)('species');
	module.exports = function(C){
	  if(__webpack_require__(30) && !(SPECIES in C))$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(25)
	  , macrotask = __webpack_require__(77).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , isNode    = __webpack_require__(20)(process) == 'process'
	  , head, last, notify;

	var flush = function(){
	  var parent, domain;
	  if(isNode && (parent = process.domain)){
	    process.domain = null;
	    parent.exit();
	  }
	  while(head){
	    domain = head.domain;
	    if(domain)domain.enter();
	    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
	    if(domain)domain.exit();
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	}

	// Node.js
	if(isNode){
	  notify = function(){
	    process.nextTick(flush);
	  };
	// browsers with MutationObserver
	} else if(Observer){
	  var toggle = 1
	    , node   = document.createTextNode('');
	  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	  notify = function(){
	    node.data = toggle = -toggle;
	  };
	// for other environments - macrotask based on:
	// - setImmediate
	// - MessageChannel
	// - window.postMessag
	// - onreadystatechange
	// - setTimeout
	} else {
	  notify = function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    macrotask.call(global, flush);
	  };
	}

	module.exports = function asap(fn){
	  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
	  if(last)last.next = task;
	  if(!head){
	    head = task;
	    notify();
	  } last = task;
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx                = __webpack_require__(66)
	  , invoke             = __webpack_require__(78)
	  , html               = __webpack_require__(79)
	  , cel                = __webpack_require__(80)
	  , global             = __webpack_require__(25)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listner = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(20)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listner, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(25).document && document.documentElement;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(43)
	  , document = __webpack_require__(25).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var $redef = __webpack_require__(27);
	module.exports = function(target, src){
	  for(var key in src)$redef(target, key, src[key]);
	  return target;
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(33)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(64);
	__webpack_require__(38);
	__webpack_require__(13);
	__webpack_require__(85);
	__webpack_require__(88);
	module.exports = __webpack_require__(26).Set;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(86);

	// 23.2 Set Objects
	__webpack_require__(87)('Set', function(get){
	  return function Set(){ return get(this, arguments[0]); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(7)
	  , hide         = __webpack_require__(28)
	  , ctx          = __webpack_require__(66)
	  , species      = __webpack_require__(75)
	  , strictNew    = __webpack_require__(68)
	  , defined      = __webpack_require__(21)
	  , forOf        = __webpack_require__(69)
	  , step         = __webpack_require__(16)
	  , ID           = __webpack_require__(35)('id')
	  , $has         = __webpack_require__(32)
	  , isObject     = __webpack_require__(43)
	  , isExtensible = Object.isExtensible || isObject
	  , SUPPORT_DESC = __webpack_require__(30)
	  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
	  , id           = 0;

	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	};

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined;      // first entry
	      that._l = undefined;      // last entry
	      that[SIZE] = 0;           // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    __webpack_require__(81)(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments[1], 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    __webpack_require__(22)(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    species(C);
	    species(__webpack_require__(26)[NAME]); // for wrapper
	  }
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(7)
	  , $def       = __webpack_require__(24)
	  , hide       = __webpack_require__(28)
	  , forOf      = __webpack_require__(69)
	  , strictNew  = __webpack_require__(68);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = __webpack_require__(25)[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!__webpack_require__(30) || typeof C != 'function'
	    || !(IS_WEAK || proto.forEach && !__webpack_require__(31)(function(){ new C().entries().next(); }))
	  ){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    __webpack_require__(81)(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      strictNew(target, C, NAME);
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var chain = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return chain ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  __webpack_require__(37)(C, NAME);

	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $def  = __webpack_require__(24);

	$def($def.P, 'Set', {toJSON: __webpack_require__(89)('Set')});

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var forOf   = __webpack_require__(69)
	  , classof = __webpack_require__(45);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var ListNode = (function (_Node) {
	    _inherits(ListNode, _Node);

	    function ListNode() {
	        _classCallCheck(this, ListNode);

	        _get(Object.getPrototypeOf(ListNode.prototype), "constructor", this).call(this);
	        this.first = null;
	        this.last = null;
	        this.append.apply(this, arguments);
	    }

	    _createClass(ListNode, [{
	        key: "append",
	        value: function append() {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
	                    nodes[_key] = arguments[_key];
	                }

	                for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var node = _step.value;

	                    node.next = null;
	                    node.parent = this;
	                    if (this.first === null && this.last === null) {
	                        this.first = node;
	                        this.last = node;
	                        node.prev = null;
	                    } else {
	                        this.last.next = node;
	                        node.prev = this.last;
	                        this.last = node;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator["return"]) {
	                        _iterator["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "prepend",
	        value: function prepend() {
	            // TODO: determine if nodes should be reversed or not
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                    nodes[_key2] = arguments[_key2];
	                }

	                for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var node = _step2.value;

	                    node.prev = null;
	                    node.parent = this;
	                    if (this.first === null && this.last === null) {
	                        this.first = node;
	                        this.last = node;
	                        node.next = null;
	                    } else {
	                        this.first.prev = node;
	                        node.next = this.first;
	                        this.first = node;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	                        _iterator2["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "replace",
	        value: function replace(current, replacement) {
	            replacement.prev = current.prev;
	            replacement.next = current.next;
	            if (current.prev !== null) {
	                current.prev.next = replacement;
	            }
	            if (current.next !== null) {
	                current.next.prev = replacement;
	            }
	            current.prev = null;
	            current.next = null;
	            if (this.first === current) {
	                this.first = replacement;
	            }
	            if (this.last === current) {
	                this.last = replacement;
	            }
	        }
	    }, {
	        key: "remove",
	        value: function remove(node) {
	            if (this.first === node) {
	                this.first = node.next;
	                if (this.first) {
	                    this.first.prev = null;
	                }
	            } else {
	                node.prev.next = node.next;
	            }
	            if (this.last === node) {
	                this.last = node.prev;
	                if (this.last) {
	                    this.last.next = null;
	                }
	            } else {
	                node.next.prev = node.prev;
	            }
	        }
	    }, {
	        key: Symbol.iterator,
	        value: regeneratorRuntime.mark(function value() {
	            var node, current;
	            return regeneratorRuntime.wrap(function value$(context$2$0) {
	                while (1) switch (context$2$0.prev = context$2$0.next) {
	                    case 0:
	                        node = this.first;

	                    case 1:
	                        if (!(node !== null)) {
	                            context$2$0.next = 8;
	                            break;
	                        }

	                        current = node;

	                        node = node.next;
	                        context$2$0.next = 6;
	                        return current;

	                    case 6:
	                        context$2$0.next = 1;
	                        break;

	                    case 8:
	                    case "end":
	                        return context$2$0.stop();
	                }
	            }, value, this);
	        })
	    }, {
	        key: "toString",
	        value: function toString() {
	            var result = "[";
	            var first = true;
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var node = _step3.value;

	                    if (!first) {
	                        result += ", ";
	                    } else {
	                        first = false;
	                    }
	                    result += node.toString();
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
	                        _iterator3["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }

	            result += "]";
	            return result;
	        }
	    }, {
	        key: "length",
	        get: function get() {
	            var count = 0;
	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;

	            try {
	                for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                    var node = _step4.value;

	                    count++;
	                }
	            } catch (err) {
	                _didIteratorError4 = true;
	                _iteratorError4 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
	                        _iterator4["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError4) {
	                        throw _iteratorError4;
	                    }
	                }
	            }

	            return count;
	        }
	    }]);

	    return ListNode;
	})(_node2["default"]);

	exports["default"] = ListNode;
	module.exports = exports["default"];

	// grab the current node so that we can do replacements while
	// iterating

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var operations = {
	    '+': function _(a, b) {
	        return a + b;
	    },
	    '-': function _(a, b) {
	        return a - b;
	    },
	    '*': function _(a, b) {
	        return a * b;
	    },
	    '/': function _(a, b) {
	        return a / b;
	    } // TODO when/how to keep things as fractions
	};

	var Operator = (function (_Node) {
	    _inherits(Operator, _Node);

	    function Operator(operator) {
	        _classCallCheck(this, Operator);

	        _get(Object.getPrototypeOf(Operator.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Operator', operator: operator });
	    }

	    _createClass(Operator, [{
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + this.operator;
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Operator(this.operator);
	        }
	    }, {
	        key: 'evaluate',
	        value: function evaluate() {
	            var prev = this.prev;
	            var next = this.next;

	            if (prev !== null && next !== null) {
	                if (prev.type === 'Literal' && next.next === 'Literal') {
	                    var result = new Literal(operations[this.operator](prev, next));

	                    var _parent2 = this[_parent];
	                    _parent2.remove(prev);
	                    _parent2.remove(next);
	                    _parent2.replace(this, result);
	                }
	            }
	        }
	    }]);

	    return Operator;
	})(_node2['default']);

	exports['default'] = Operator;
	module.exports = exports['default'];

/***/ },
/* 92 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _id = 0;

	//export default class Node {
	//    constructor() {
	//        this.id = _id++;
	//    }
	//}

	var Node = function Node() {
	    _classCallCheck(this, Node);

	    this.id = _id++;
	    this.parent = null;
	    this.next = null;
	    this.prev = null;
	};

	exports["default"] = Node;
	module.exports = exports["default"];

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var _expression = __webpack_require__(2);

	var _expression2 = _interopRequireDefault(_expression);

	var Fraction = (function (_Node) {
	    _inherits(Fraction, _Node);

	    function Fraction(numerator, denominator) {
	        _classCallCheck(this, Fraction);

	        _get(Object.getPrototypeOf(Fraction.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Fraction', numerator: numerator, denominator: denominator });
	    }

	    _createClass(Fraction, [{
	        key: 'add',
	        value: function add(node) {
	            return new _expression2['default'](this, new Operator('+'), node);
	        }
	    }, {
	        key: 'subtract',
	        value: function subtract(node) {
	            return new _expression2['default'](this, new Operator('-'), node);
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(node) {
	            return this.append(new Operator('*'), node);
	        }
	    }, {
	        key: 'divide',
	        value: function divide(node) {
	            return new Fraction(this, node);
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return '[' + this.type + ':' + this.numerator + '/' + this.denominator + ']';
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Fraction(this.numerator.clone(), this.denominator.clone());
	        }
	    }]);

	    return Fraction;
	})(_node2['default']);

	exports['default'] = Fraction;
	module.exports = exports['default'];

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var Identifier = (function (_Node) {
	    _inherits(Identifier, _Node);

	    function Identifier(name) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        _classCallCheck(this, Identifier);

	        _get(Object.getPrototypeOf(Identifier.prototype), 'constructor', this).call(this);
	        this.type = 'Identifier';
	        this.name = name;
	        this.subscript = options.subscript || null;
	        this.accent = options.accent || null;
	    }

	    _createClass(Identifier, [{
	        key: 'add',
	        value: function add(node) {
	            return new Expression(this, new Operator('+'), node);
	        }
	    }, {
	        key: 'subtract',
	        value: function subtract(node) {
	            return new Expression(this, new Operator('-'), node);
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(node) {
	            return new Product(this, new Operator('*'), node);
	        }
	    }, {
	        key: 'divide',
	        value: function divide(node) {
	            return new Fraction(this, node);
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + this.name;
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Identifier(this.value);
	        }
	    }]);

	    return Identifier;
	})(_node2['default']);

	exports['default'] = Identifier;
	module.exports = exports['default'];

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var Literal = (function (_Node) {
	    _inherits(Literal, _Node);

	    function Literal(value) {
	        _classCallCheck(this, Literal);

	        _get(Object.getPrototypeOf(Literal.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Literal', value: value });
	    }

	    _createClass(Literal, [{
	        key: 'add',
	        value: function add(node) {
	            return new Expression(this, new Operator('+'), node);
	        }
	    }, {
	        key: 'subtract',
	        value: function subtract(node) {
	            return new Expression(this, new Operator('-'), node);
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(node) {
	            return new Product(this, new Operator('*'), node);
	        }
	    }, {
	        key: 'divide',
	        value: function divide(node) {
	            return new Fraction(this, node);
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + this.value;
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Literal(this.value);
	        }
	    }]);

	    return Literal;
	})(_node2['default']);

	exports['default'] = Literal;
	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(92);

	var _node2 = _interopRequireDefault(_node);

	var Equation = (function (_Node) {
	    _inherits(Equation, _Node);

	    function Equation(left, right) {
	        _classCallCheck(this, Equation);

	        _get(Object.getPrototypeOf(Equation.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Equation', left: left, right: right });
	    }

	    _createClass(Equation, [{
	        key: 'add',
	        value: function add(node) {
	            this.left = this.left.add(node.clone());
	            this.right = this.right.add(node.clone());
	        }
	    }, {
	        key: 'subtract',
	        value: function subtract(node) {
	            this.left = this.left.subtract(node);
	            this.right = this.right.subtract(node);
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(node) {
	            this.left = this.left.multiply(node);
	            this.right = this.right.multiply(node);
	        }
	    }, {
	        key: 'divide',
	        value: function divide(node) {
	            this.left = this.left.divide(node);
	            this.right = this.right.divide(node);
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':[' + this.left + ' = ' + this.right + ']';
	        }
	    }]);

	    return Equation;
	})(_node2['default']);

	exports['default'] = Equation;
	module.exports = exports['default'];

/***/ },
/* 97 */
/***/ function(module, exports) {

	/**
	 * Functions for creating and rendering math layouts
	 */

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'red';

	var pixelRatio = window.devicePixelRatio;

	canvas.width = 1200 * pixelRatio;
	canvas.height = 700 * pixelRatio;
	canvas.style.width = 1200 + "px";
	canvas.style.height = 700 + "px";
	ctx.scale(pixelRatio, pixelRatio);

	document.body.appendChild(canvas);

	var fontSize = 64;
	ctx.font = '100 ' + fontSize + 'px sans-serif';

	var space = ctx.measureText(" ").width;
	var paren = ctx.measureText("(").width;

	// TODO: layout objects should know about their parent as well

	/**
	 * Creates a layout
	 * 
	 * @param {Object} node A Math AST node.
	 * @param {Object} result The object to store the layout in.
	 * @param {Object?} p A point specifying where to render the layout. 
	 * @returns {Object} The layout object.
	 */
	function layout(node) {
	    var result = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var p = arguments.length <= 2 || arguments[2] === undefined ? { x: 0, y: 0 } : arguments[2];

	    var height = fontSize,
	        id = node.id;

	    if (node.type === 'Literal') {
	        console.log(node.toString());
	        var text = String(node.value).replace(/\-/g, '−');
	        if (parseFloat(node.value) < 0) {
	            text = '(' + text + ')';
	        }
	        var width = ctx.measureText(text).width;
	        result[id] = _extends({ id: id, height: height, width: width, text: text }, p);
	        p.x += width;
	    } else if (node.type === 'Operator') {
	        var text = String(node.operator).replace(/\-/g, '−');
	        var width = ctx.measureText(text).width;
	        result[id] = _extends({ id: id, width: width, height: height, text: text }, p);
	        p.x += width;
	    } else if (node.type === 'Expression') {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = node[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var child = _step.value;

	                console.log(child.toString());
	                console.log(child);
	                if (child.type === 'Operator') {
	                    p.x += space;
	                }
	                layout(child, result, p);
	                if (child.type === 'Operator') {
	                    p.x += space;
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator['return']) {
	                    _iterator['return']();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	    } else if (node.type === 'Product') {
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = node[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var child = _step2.value;

	                // TODO: option to use cdot for multiplication instead
	                if (child.type === 'Operator') {
	                    continue;
	                }
	                result[id] = _extends({ id: id + ':leftParen', width: paren, height: height, text: '(' }, p);
	                p.x += paren;
	                layout(child, result, p);
	                result[id] = _extends({ id: id + ':rightParen', width: paren, height: height, text: ')' }, p);
	                p.x += paren;
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                    _iterator2['return']();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }
	    } else if (node.type === 'Equation') {
	        layout(node.left, result, p);
	        p.x += space;

	        var width = ctx.measureText("=").width;
	        result[id] = _extends({ id: id, width: width, height: height, text: '=' }, p);

	        p.x += width + space;

	        layout(node.right, result, p);
	    }
	    return result;
	}

	/**
	 * Render a layout.
	 * 
	 * @param {Object} layout The layout to render.
	 * @param {Array} ids An array of ids specifying which parts of the expression
	 *        to render.
	 * @param {Number} t A number between 0 and 1, used for fading in new parts 
	 *        of the expression.
	 */
	function render(layout, ids, t) {
	    Object.keys(layout).forEach(function (id) {
	        var leaf = layout[id];
	        var text = String(leaf.text).replace(/\-/g, '−');
	        if (ids.indexOf(leaf.id.toString()) !== -1) {
	            ctx.fillStyle = 'rgb(0,0,0)';
	            ctx.fillText(text, leaf.x, leaf.y);
	        } else {
	            var gray = (1 - t) * 255 | 0;
	            ctx.fillStyle = 'rgb(' + gray + ',' + gray + ',255)';
	            ctx.fillText(text, leaf.x, leaf.y);
	        }
	    });
	}

	/**
	 * Interpolates between two values.
	 * 
	 * @param val1
	 * @param val2
	 * @param t
	 * @returns {number}
	 */
	function lerp(val1, val2, t) {
	    return (1 - t) * val1 + t * val2;
	}

	/**
	 * Interpolates between two layouts.
	 * 
	 * @param {Object} layout1
	 * @param {Object} layout2
	 * @param {Array} ids
	 * @param {Number} t A number between 0 and 1
	 */
	function lerpLayout(layout1, layout2, ids, t) {
	    var layout = {};
	    ids.forEach(function (id) {
	        var l1 = layout1[id];
	        var l2 = layout2[id];

	        layout[id] = {
	            id: id,
	            x: lerp(l1.x, l2.x, t),
	            y: 0,
	            text: l1.text
	        };
	    });

	    return layout;
	}

	module.exports = {
	    layout: layout,
	    render: render,
	    lerpLayout: lerpLayout,
	    ctx: ctx
	};

/***/ }
/******/ ]);
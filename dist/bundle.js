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

	var _require2 = __webpack_require__(101);

	var getMetrics = _require2.getMetrics;
	var createLayout = _require2.createLayout;
	var flatten = _require2.flatten;
	var RenderOptions = _require2.RenderOptions;

	var _require3 = __webpack_require__(103);

	var add = _require3.add;
	var sub = _require3.sub;
	var mul = _require3.mul;
	var removeExtraParens = _require3.removeExtraParens;

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

	var expr1 = undefined,
	    expr2 = undefined,
	    eqn1 = undefined;

	expr1 = add(new Literal(25), mul(new Literal(42), mul(new Identifier('pi'), new Identifier('r'))));
	expr1 = add(expr1, new Identifier('theta'));
	expr2 = sub(new Fraction(new Identifier('y'), add(new Literal(5), new Identifier('x'))), new Literal(-2));

	eqn1 = new Equation(expr1, expr2);

	var newLayout = createLayout(eqn1, 72);
	var flattenedLayout = flatten(newLayout);

	function findEqual(flatLayout) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = flatLayout.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var child = _step.value;

	            if (child.text === "=") {
	                return child;
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
	}

	var equalNode = findEqual(flattenedLayout);
	var bounds = equalNode.bounds;
	var equalX = (bounds.left + bounds.right) / 2;
	var equalY = (bounds.top + bounds.bottom) / 2;

	console.log('(' + equalX + ', ' + equalY + ')');

	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;

	var dx = centerX - equalX;
	var dy = centerY - equalY;

	function translateLayout(flatLayout, dx, dy) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	        for (var _iterator2 = flatLayout.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var child = _step2.value;

	            child.x += dx;
	            child.y += dy;
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
	}

	translateLayout(flattenedLayout, dx, dy);

	function drawAxes(ctx) {
	    var width = canvas.width;
	    var height = canvas.height;
	    ctx.strokeStyle = 'red';
	    ctx.beginPath();
	    ctx.moveTo(width / 2, 0);
	    ctx.lineTo(width / 2, height);
	    ctx.moveTo(0, height / 2);
	    ctx.lineTo(width, height / 2);
	    ctx.stroke();
	}

	var selection = null;
	RenderOptions.bounds = false;
	RenderOptions.axes = false;

	function draw() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);

	    if (RenderOptions.axes) {
	        drawAxes(ctx);
	    }

	    if (selection) {
	        ctx.fillStyle = 'rgba(255,255,0,0.5)';
	        console.log(selection);

	        var _bounds = selection.bounds;

	        var width = _bounds.right - _bounds.left;
	        var height = _bounds.bottom - _bounds.top;
	        var x = _bounds.left;
	        var y = _bounds.top;
	        var padding = 8;
	        var radius = width / 2 + padding;

	        if (selection.circle) {
	            ctx.beginPath();
	            ctx.arc(x + width / 2, y + height / 2, radius, 0, 2 * Math.PI, false);
	            ctx.closePath();
	            ctx.fill();
	        } else {
	            ctx.fillRect(x, y, width, height);
	        }
	    }

	    ctx.fillStyle = 'black';
	    flattenedLayout.render(ctx);
	}

	draw();

	function findNode(node, id) {
	    if (node.id === id) {
	        return node;
	    } else if (["Expression", "Product"].includes(node.type)) {
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = node[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var child = _step3.value;

	                var result = findNode(child, id);
	                if (result) {
	                    return result;
	                }
	            }
	        } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                    _iterator3['return']();
	                }
	            } finally {
	                if (_didIteratorError3) {
	                    throw _iteratorError3;
	                }
	            }
	        }
	    } else if (node.type === "Equation") {
	        var lhs = findNode(node.left, id);
	        if (lhs) return lhs;
	        var rhs = findNode(node.right, id);
	        if (rhs) return rhs;
	    } else if (node.type === "Fraction") {
	        var num = findNode(node.numerator, id);
	        if (num) return num;
	        var den = findNode(node.denominator, id);
	        if (den) return den;
	    }
	}

	document.addEventListener('click', function (e) {
	    var layoutNode = flattenedLayout.hitTest(e.pageX, e.pageY);
	    if (layoutNode) {
	        var id = layoutNode.id;

	        var selectedNode = findNode(eqn1, id);

	        if (layoutNode !== selection) {
	            selection = layoutNode;
	            var _bounds2 = layoutNode.bounds;
	            showMenu(['apple', 'banana', 'cupcake'], (_bounds2.left + _bounds2.right) / 2, _bounds2.top - 10);
	        } else {
	            selection = null;
	            if (menu) {
	                document.body.removeChild(menu);
	                menu = null;
	            }
	        }
	    } else {
	        selection = null;
	        if (menu) {
	            document.body.removeChild(menu);
	            menu = null;
	        }
	    }

	    draw();
	});

	var menu = null;

	function showMenu(items, x, y) {
	    if (menu) {
	        document.body.removeChild(menu);
	    }
	    menu = document.createElement('div');
	    var k = 160;
	    var a = 0.95;

	    var container = document.createElement('div');
	    Object.assign(container.style, {
	        display: 'inline-block',
	        backgroundColor: 'rgba(' + k + ',' + k + ',' + k + ',' + a + ')',
	        color: 'white',
	        fontSize: '36px',
	        fontFamily: 'Helvetica',
	        fontWeight: '100',
	        padding: '10px',
	        borderRadius: '10px'
	    });

	    Object.assign(menu.style, {
	        display: 'inline-block',
	        position: 'absolute',
	        left: x + 'px',
	        top: y + 'px',
	        transform: 'translate(-50%, -100%)'
	    });

	    var ul = document.createElement('ul');
	    Object.assign(ul.style, {
	        listStyleType: 'none',
	        padding: 0,
	        margin: 0
	    });

	    var _iteratorNormalCompletion4 = true;
	    var _didIteratorError4 = false;
	    var _iteratorError4 = undefined;

	    try {
	        var _loop = function () {
	            var item = _step4.value;

	            var li = document.createElement('li');
	            Object.assign(li.style, {
	                cursor: 'pointer'
	            });
	            li.onmouseover = function () {
	                return li.style.color = 'rgb(255,255,128)';
	            };
	            li.onmouseout = function () {
	                return li.style.color = 'white';
	            };
	            li.innerText = item;
	            ul.appendChild(li);
	        };

	        for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            _loop();
	        }
	    } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                _iterator4['return']();
	            }
	        } finally {
	            if (_didIteratorError4) {
	                throw _iteratorError4;
	            }
	        }
	    }

	    container.appendChild(ul);
	    menu.appendChild(container);

	    var triangle = document.createElement('div');
	    Object.assign(triangle.style, {
	        width: 0,
	        height: 0,
	        borderStyle: 'solid',
	        borderWidth: '10px 10px 0 10px',
	        borderColor: 'rgba(' + k + ',' + k + ',' + k + ',' + a + ') transparent transparent transparent',
	        margin: 'auto'
	    });

	    menu.appendChild(triangle);

	    // TODO: cleanup event listeners when removing menu
	    container.addEventListener('click', function (e) {
	        e.stopPropagation();
	    });

	    document.body.appendChild(menu);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _astExpression = __webpack_require__(2);

	var _astExpression2 = _interopRequireDefault(_astExpression);

	var _astProduct = __webpack_require__(95);

	var _astProduct2 = _interopRequireDefault(_astProduct);

	var _astFraction = __webpack_require__(96);

	var _astFraction2 = _interopRequireDefault(_astFraction);

	var _astOperator = __webpack_require__(94);

	var _astOperator2 = _interopRequireDefault(_astOperator);

	var _astIdentifier = __webpack_require__(97);

	var _astIdentifier2 = _interopRequireDefault(_astIdentifier);

	var _astLiteral = __webpack_require__(98);

	var _astLiteral2 = _interopRequireDefault(_astLiteral);

	var _astEquation = __webpack_require__(99);

	var _astEquation2 = _interopRequireDefault(_astEquation);

	module.exports = {
	    Expression: _astExpression2['default'],
	    Product: _astProduct2['default'],
	    Fraction: _astFraction2['default'],
	    Operator: _astOperator2['default'],
	    Identifier: _astIdentifier2['default'],
	    Literal: _astLiteral2['default'],
	    Equation: _astEquation2['default']
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var _bind = Function.prototype.bind;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _functify = __webpack_require__(3);

	var _functify2 = _interopRequireDefault(_functify);

	var _listNode = __webpack_require__(92);

	var _listNode2 = _interopRequireDefault(_listNode);

	var _operator = __webpack_require__(94);

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
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + _get(Object.getPrototypeOf(Expression.prototype), 'toString', this).call(this);
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new (_bind.apply(Expression, [null].concat(_toConsumableArray((0, _functify2['default'])(this).map(function (x) {
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

	var _Symbol$iterator = __webpack_require__(51)["default"];

	var _regeneratorRuntime = __webpack_require__(53)["default"];

	var _getIterator = __webpack_require__(11)["default"];

	var _Set = __webpack_require__(85)["default"];

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

	var _isIterable = __webpack_require__(48)["default"];

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
	__webpack_require__(40);
	module.exports = __webpack_require__(43);

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
	var addToUnscopables = __webpack_require__(15)
	  , step             = __webpack_require__(16)
	  , Iterators        = __webpack_require__(17)
	  , toIObject        = __webpack_require__(18);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(22)(Array, 'Array', function(iterated, kind){
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

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

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

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(20);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
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
	var LIBRARY        = __webpack_require__(23)
	  , $export        = __webpack_require__(24)
	  , redefine       = __webpack_require__(29)
	  , hide           = __webpack_require__(30)
	  , has            = __webpack_require__(34)
	  , Iterators      = __webpack_require__(17)
	  , $iterCreate    = __webpack_require__(35)
	  , setToStringTag = __webpack_require__(36)
	  , getProto       = __webpack_require__(7).getProto
	  , ITERATOR       = __webpack_require__(37)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
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
	  , ctx       = __webpack_require__(27)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 25 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 26 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(28);
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
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(30);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(7)
	  , createDesc = __webpack_require__(31);
	module.exports = __webpack_require__(32) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 31 */
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(33)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(7)
	  , descriptor     = __webpack_require__(31)
	  , setToStringTag = __webpack_require__(36)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(30)(IteratorPrototype, __webpack_require__(37)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(7).setDesc
	  , has = __webpack_require__(34)
	  , TAG = __webpack_require__(37)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(38)('wks')
	  , uid    = __webpack_require__(39)
	  , Symbol = __webpack_require__(25).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(25)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(41)(true);

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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(42)
	  , defined   = __webpack_require__(21);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(44)
	  , get      = __webpack_require__(46);
	module.exports = __webpack_require__(26).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(47)
	  , ITERATOR  = __webpack_require__(37)('iterator')
	  , Iterators = __webpack_require__(17);
	module.exports = __webpack_require__(26).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(20)
	  , TAG = __webpack_require__(37)('toStringTag')
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(49), __esModule: true };

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(13);
	__webpack_require__(40);
	module.exports = __webpack_require__(50);

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(47)
	  , ITERATOR  = __webpack_require__(37)('iterator')
	  , Iterators = __webpack_require__(17);
	module.exports = __webpack_require__(26).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(52), __esModule: true };

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(40);
	__webpack_require__(13);
	module.exports = __webpack_require__(37)('iterator');

/***/ },
/* 53 */
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

	module.exports = __webpack_require__(54);

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
/* 54 */
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

	var _Symbol = __webpack_require__(56)["default"];

	var _Symbol$iterator = __webpack_require__(51)["default"];

	var _Object$create = __webpack_require__(64)["default"];

	var _Promise = __webpack_require__(66)["default"];

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 55 */
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(58);
	__webpack_require__(63);
	module.exports = __webpack_require__(26).Symbol;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(7)
	  , global         = __webpack_require__(25)
	  , has            = __webpack_require__(34)
	  , DESCRIPTORS    = __webpack_require__(32)
	  , $export        = __webpack_require__(24)
	  , redefine       = __webpack_require__(29)
	  , $fails         = __webpack_require__(33)
	  , shared         = __webpack_require__(38)
	  , setToStringTag = __webpack_require__(36)
	  , uid            = __webpack_require__(39)
	  , wks            = __webpack_require__(37)
	  , keyOf          = __webpack_require__(59)
	  , $names         = __webpack_require__(60)
	  , enumKeys       = __webpack_require__(61)
	  , isArray        = __webpack_require__(62)
	  , anObject       = __webpack_require__(44)
	  , toIObject      = __webpack_require__(18)
	  , createDesc     = __webpack_require__(31)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
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
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(23)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

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
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
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

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 59 */
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(18)
	  , getNames  = __webpack_require__(7).getNames
	  , toString  = {}.toString;

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
/* 61 */
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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(20);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(40);
	__webpack_require__(13);
	__webpack_require__(68);
	module.exports = __webpack_require__(26).Promise;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(7)
	  , LIBRARY    = __webpack_require__(23)
	  , global     = __webpack_require__(25)
	  , ctx        = __webpack_require__(27)
	  , classof    = __webpack_require__(47)
	  , $export    = __webpack_require__(24)
	  , isObject   = __webpack_require__(45)
	  , anObject   = __webpack_require__(44)
	  , aFunction  = __webpack_require__(28)
	  , strictNew  = __webpack_require__(69)
	  , forOf      = __webpack_require__(70)
	  , setProto   = __webpack_require__(74).set
	  , same       = __webpack_require__(75)
	  , SPECIES    = __webpack_require__(37)('species')
	  , speciesConstructor = __webpack_require__(76)
	  , asap       = __webpack_require__(77)
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

	var USE_NATIVE = function(){
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
	    if(works && __webpack_require__(32)){
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
	var PromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve),
	  this.reject  = aFunction(reject)
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(record, isReject){
	  if(record.n)return;
	  record.n = true;
	  var chain = record.c;
	  asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , result, then;
	      try {
	        if(handler){
	          if(!ok)record.h = true;
	          result = handler === true ? value : handler(value);
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	    record.n = false;
	    if(isReject)setTimeout(function(){
	      var promise = record.p
	        , handler, console;
	      if(isUnhandled(promise)){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      } record.a = undefined;
	    }, 1);
	  });
	};
	var isUnhandled = function(promise){
	  var record = promise._d
	    , chain  = record.a || record.c
	    , i      = 0
	    , reaction;
	  if(record.h)return false;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
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
	    if(record.p === value)throw TypeError("Promise can't be resolved itself");
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
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    aFunction(executor);
	    var record = this._d = {
	      p: strictNew(this, P, PROMISE),         // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false,                               // <- handled rejection
	      n: false                                // <- notify
	    };
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(82)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction = new PromiseCapability(speciesConstructor(this, P))
	        , promise  = reaction.promise
	        , record   = this._d;
	      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      record.c.push(reaction);
	      if(record.a)record.a.push(reaction);
	      if(record.s)notify(record, false);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
	__webpack_require__(36)(P, PROMISE);
	__webpack_require__(83)(PROMISE);
	Wrapper = __webpack_require__(26)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = new PromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof P && sameConstructor(x.constructor, this))return x;
	    var capability = new PromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(84)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject
	      , values     = [];
	    var abrupt = perform(function(){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        var alreadyCalled = false;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled = true;
	          results[index] = value;
	          --remaining || resolve(results);
	        }, reject);
	      });
	      else resolve(results);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(27)
	  , call        = __webpack_require__(71)
	  , isArrayIter = __webpack_require__(72)
	  , anObject    = __webpack_require__(44)
	  , toLength    = __webpack_require__(73)
	  , getIterFn   = __webpack_require__(46);
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
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(44);
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
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(17)
	  , ITERATOR   = __webpack_require__(37)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(42)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(7).getDesc
	  , isObject = __webpack_require__(45)
	  , anObject = __webpack_require__(44);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(27)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(44)
	  , aFunction = __webpack_require__(28)
	  , SPECIES   = __webpack_require__(37)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(25)
	  , macrotask = __webpack_require__(78).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(20)(process) == 'process'
	  , head, last, notify;

	var flush = function(){
	  var parent, domain, fn;
	  if(isNode && (parent = process.domain)){
	    process.domain = null;
	    parent.exit();
	  }
	  while(head){
	    domain = head.domain;
	    fn     = head.fn;
	    if(domain)domain.enter();
	    fn(); // <- currently we use it only for Promise - try / catch not required
	    if(domain)domain.exit();
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	};

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
	// environments with maybe non-completely correct, but existent Promise
	} else if(Promise && Promise.resolve){
	  notify = function(){
	    Promise.resolve().then(flush);
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
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(27)
	  , invoke             = __webpack_require__(79)
	  , html               = __webpack_require__(80)
	  , cel                = __webpack_require__(81)
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
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
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
/* 79 */
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
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(25).document && document.documentElement;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45)
	  , document = __webpack_require__(25).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(29);
	module.exports = function(target, src){
	  for(var key in src)redefine(target, key, src[key]);
	  return target;
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var core        = __webpack_require__(26)
	  , $           = __webpack_require__(7)
	  , DESCRIPTORS = __webpack_require__(32)
	  , SPECIES     = __webpack_require__(37)('species');

	module.exports = function(KEY){
	  var C = core[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(37)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(40);
	__webpack_require__(13);
	__webpack_require__(87);
	__webpack_require__(90);
	module.exports = __webpack_require__(26).Set;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(88);

	// 23.2 Set Objects
	__webpack_require__(89)('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(7)
	  , hide         = __webpack_require__(30)
	  , redefineAll  = __webpack_require__(82)
	  , ctx          = __webpack_require__(27)
	  , strictNew    = __webpack_require__(69)
	  , defined      = __webpack_require__(21)
	  , forOf        = __webpack_require__(70)
	  , $iterDefine  = __webpack_require__(22)
	  , step         = __webpack_require__(16)
	  , ID           = __webpack_require__(39)('id')
	  , $has         = __webpack_require__(34)
	  , isObject     = __webpack_require__(45)
	  , setSpecies   = __webpack_require__(83)
	  , DESCRIPTORS  = __webpack_require__(32)
	  , isExtensible = Object.isExtensible || isObject
	  , SIZE         = DESCRIPTORS ? '_s' : 'size'
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
	    redefineAll(C.prototype, {
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
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
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
	    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
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
	    $iterDefine(C, NAME, function(iterated, kind){
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
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(7)
	  , global         = __webpack_require__(25)
	  , $export        = __webpack_require__(24)
	  , fails          = __webpack_require__(33)
	  , hide           = __webpack_require__(30)
	  , redefineAll    = __webpack_require__(82)
	  , forOf          = __webpack_require__(70)
	  , strictNew      = __webpack_require__(69)
	  , isObject       = __webpack_require__(45)
	  , setToStringTag = __webpack_require__(36)
	  , DESCRIPTORS    = __webpack_require__(32);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      strictNew(target, C, NAME);
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(24);

	$export($export.P, 'Set', {toJSON: __webpack_require__(91)('Set')});

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var forOf   = __webpack_require__(70)
	  , classof = __webpack_require__(47);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

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
/* 93 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _id = 0;

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
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

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

	                    var _parent = this.parent;
	                    _parent.remove(prev);
	                    _parent.remove(next);
	                    _parent.replace(this, result);
	                }
	            }
	        }
	    }]);

	    return Operator;
	})(_node2['default']);

	exports['default'] = Operator;
	module.exports = exports['default'];

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var _bind = Function.prototype.bind;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _listNode = __webpack_require__(92);

	var _listNode2 = _interopRequireDefault(_listNode);

	var _functify = __webpack_require__(3);

	var _functify2 = _interopRequireDefault(_functify);

	var Product = (function (_ListNode) {
	    _inherits(Product, _ListNode);

	    function Product() {
	        _classCallCheck(this, Product);

	        _get(Object.getPrototypeOf(Product.prototype), 'constructor', this).call(this);
	        this.type = 'Product';
	        this.append.apply(this, arguments);
	    }

	    _createClass(Product, [{
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + _get(Object.getPrototypeOf(Product.prototype), 'toString', this).call(this);
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new (_bind.apply(Product, [null].concat(_toConsumableArray((0, _functify2['default'])(this).map(function (x) {
	                return x.clone();
	            })))))();
	        }
	    }]);

	    return Product;
	})(_listNode2['default']);

	exports['default'] = Product;
	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

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
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

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
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

	var _node2 = _interopRequireDefault(_node);

	var Literal = (function (_Node) {
	    _inherits(Literal, _Node);

	    function Literal(value) {
	        _classCallCheck(this, Literal);

	        _get(Object.getPrototypeOf(Literal.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Literal', value: value });
	    }

	    _createClass(Literal, [{
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':' + this.value + '(' + this.id + ')';
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
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _node = __webpack_require__(93);

	var _node2 = _interopRequireDefault(_node);

	var Equation = (function (_Node) {
	    _inherits(Equation, _Node);

	    function Equation(left, right) {
	        _classCallCheck(this, Equation);

	        _get(Object.getPrototypeOf(Equation.prototype), 'constructor', this).call(this);
	        Object.assign(this, { type: 'Equation', left: left, right: right });
	    }

	    _createClass(Equation, [{
	        key: 'toString',
	        value: function toString() {
	            return this.type + ':[' + this.left + ' = ' + this.right + ']';
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Equation(this.left.clone(), this.right.clone());
	        }
	    }]);

	    return Equation;
	})(_node2['default']);

	exports['default'] = Equation;
	module.exports = exports['default'];

/***/ },
/* 100 */,
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var fontMetrics = __webpack_require__(102);

	// TODO: handle fonts with different unitsPerEm
	var unitsPerEm = fontMetrics.unitsPerEm;
	var glyphMetrics = fontMetrics.glyphMetrics;

	var RenderOptions = {
	    bounds: false
	};

	function formatText(text) {
	    if (parseFloat(text) < 0) {
	        text = "(" + text + ")";
	    }
	    return String(text).replace(/\-/g, "−").replace(/\*/g, "·");
	}

	function getMetrics(c, fontSize) {
	    var result = {};
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = Object.entries(glyphMetrics[c.charCodeAt(0)])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _step$value = _slicedToArray(_step.value, 2);

	            var k = _step$value[0];
	            var v = _step$value[1];

	            result[k] = fontSize * v / unitsPerEm;
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

	    return result;
	}

	var Glyph = (function () {
	    function Glyph(c, fontSize) {
	        var metrics = arguments.length <= 2 || arguments[2] === undefined ? getMetrics(c, fontSize) : arguments[2];
	        return (function () {
	            _classCallCheck(this, Glyph);

	            this.x = 0;
	            this.y = 0;
	            this.text = c;
	            this.fontSize = fontSize;

	            this.metrics = metrics;
	            this.advance = this.metrics.advance;
	        }).apply(this, arguments);
	    }

	    _createClass(Glyph, [{
	        key: "render",
	        value: function render(ctx) {
	            // TODO when we flatten group all of the items with the same fontSize
	            if (this.id && RenderOptions.bounds) {
	                ctx.strokeStyle = 'red';
	                var bounds = this.bounds;
	                ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
	            }

	            var weight = 100;
	            ctx.font = weight + " " + this.fontSize + "px Helvetica";
	            ctx.fillStyle = 'black';
	            ctx.fillText(this.text, this.x, this.y);
	        }
	    }, {
	        key: "clone",
	        value: function clone() {
	            var result = new Glyph(this.text, this.fontSize);
	            Object.assign(result, this);
	            return result;
	        }
	    }, {
	        key: "hitTest",
	        value: function hitTest(x, y) {
	            var _bounds = this.bounds;
	            var left = _bounds.left;
	            var right = _bounds.right;
	            var top = _bounds.top;
	            var bottom = _bounds.bottom;

	            if (x >= left && x <= right && y >= top && y <= bottom) {
	                return this;
	            }
	        }
	    }, {
	        key: "bounds",
	        get: function get() {
	            var _metrics = this.metrics;
	            var bearingX = _metrics.bearingX;
	            var bearingY = _metrics.bearingY;
	            var width = _metrics.width;
	            var height = _metrics.height;

	            var left = this.x + bearingX;
	            var right = left + width;
	            var top = this.y - bearingY - height;
	            var bottom = top + height;
	            return { left: left, right: right, top: top, bottom: bottom };
	        }
	    }]);

	    return Glyph;
	})();

	var Box = (function () {
	    function Box(x, y, width, height) {
	        _classCallCheck(this, Box);

	        Object.assign(this, { x: x, y: y, width: width, height: height });
	    }

	    _createClass(Box, [{
	        key: "render",
	        value: function render(ctx) {
	            ctx.fillRect(this.x, this.y, this.width, this.height);
	        }
	    }, {
	        key: "clone",
	        value: function clone() {
	            return new Box(this.x, this.y, this.width, this.height);
	        }
	    }, {
	        key: "hitTest",
	        value: function hitTest(x, y) {}
	    }]);

	    return Box;
	})();

	var Layout = (function () {
	    function Layout(children) {
	        var atomic = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	        _classCallCheck(this, Layout);

	        this.x = 0;
	        this.y = 0;
	        Object.assign(this, { children: children, atomic: atomic });
	    }

	    _createClass(Layout, [{
	        key: "render",
	        value: function render(ctx) {
	            ctx.save();
	            ctx.translate(this.x, this.y);
	            if (this.atomic && RenderOptions.bounds) {
	                ctx.strokeStyle = 'red';
	                var bounds = this.bounds;
	                ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
	            }

	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var child = _step2.value;

	                    child.render(ctx);
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

	            ctx.restore();
	        }
	    }, {
	        key: "clone",
	        value: function clone() {
	            var result = new Layout(this.children.map(function (child) {
	                return child.clone();
	            }), this.atomic);
	            result.id = this.id;
	            result.x = this.x;
	            result.y = this.y;
	            return result;
	        }
	    }, {
	        key: "hitTest",
	        value: function hitTest(x, y) {
	            if (this.atomic) {
	                var bounds = this.bounds;
	                if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
	                    return this;
	                }
	            }
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var child = _step3.value;

	                    var result = child.hitTest(x - this.x, y - this.y);
	                    if (result) {
	                        return result;
	                    }
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
	        }
	    }, {
	        key: "bounds",
	        get: function get() {
	            var initialBounds = {
	                left: Infinity,
	                right: -Infinity,
	                top: Infinity,
	                bottom: -Infinity
	            };

	            var bounds = this.children.reduce(function (bounds, child) {
	                var childBounds = child.bounds;
	                return {
	                    left: Math.min(bounds.left, childBounds.left),
	                    right: Math.max(bounds.right, childBounds.right),
	                    top: Math.min(bounds.top, childBounds.top),
	                    bottom: Math.max(bounds.bottom, childBounds.bottom)
	                };
	            }, initialBounds);

	            bounds.left += this.x;
	            bounds.right += this.x;
	            bounds.top += this.y;
	            bounds.bottom += this.y;

	            return bounds;
	        }
	    }]);

	    return Layout;
	})();

	function formatIdentifier(identifier) {
	    if (identifier.length > 1) {
	        // TODO: have a fallback when we don't have the glyph
	        if (identifier === 'pi') {
	            return "π";
	        } else if (identifier === 'theta') {
	            return "θ";
	        }
	    }
	    return identifier;
	}

	function makeMetricsSquare(metrics) {
	    if (metrics.width >= metrics.height) {
	        var vPad = (metrics.width - metrics.height) / 2;
	        return {
	            bearingX: metrics.bearingX,
	            bearingY: metrics.bearingY - vPad,
	            width: metrics.width,
	            height: metrics.height + 2 * vPad
	        };
	    } else {
	        var hPad = (metrics.height - metrics.width) / 2;
	        return {
	            bearingX: metrics.bearingX - hPad,
	            bearingY: metrics.bearingY,
	            width: metrics.width + 2 * hPad,
	            height: metrics.height
	        };
	    }
	}

	function createLayout(node, fontSize) {
	    var spaceMetrics = getMetrics(" ", fontSize);
	    var dashMetrics = getMetrics("−", fontSize);

	    if (node.type === "Literal") {
	        var text = formatText(String(node.value));

	        var penX = 0;
	        var layouts = [];

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = text[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var c = _step4.value;

	                var glyph = new Glyph(c, fontSize);

	                glyph.x = penX;
	                penX += glyph.advance;

	                layouts.push(glyph);
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

	        var layout = new Layout(layouts, true);
	        layout.advance = penX;
	        layout.id = node.id;
	        return layout;
	    } else if (node.type === "Identifier") {
	        var _name = formatIdentifier(node.name);
	        // TODO handle multi character identifiers such as sin, cos, tan, etc.
	        var glyph = new Glyph(_name, fontSize);
	        glyph.id = node.id;
	        return glyph;
	    } else if (node.type === "Operator") {
	        var operator = formatText(node.operator);
	        var glyph = new Glyph(operator, fontSize);
	        if (node.operator === "-") {
	            glyph.metrics = makeMetricsSquare(glyph.metrics);
	        }
	        if (node.operator === "*") {
	            // TODO: make some methods for center bounds and getting their centers
	            var centerX = glyph.metrics.bearingX + glyph.metrics.width / 2;
	            var centerY = glyph.metrics.bearingY + glyph.metrics.height / 2;
	            var radius = glyph.metrics.width;
	            glyph.metrics.bearingX = centerX - radius;
	            glyph.metrics.bearingY = centerY - radius;
	            glyph.metrics.width = 2 * radius;
	            glyph.metrics.height = 2 * radius;
	            console.log(radius * 2);
	        }
	        glyph.id = node.id;
	        glyph.circle = true;
	        return glyph;
	    } else if (node.type === "Expression") {
	        var penX = 0;
	        var layouts = [];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = node[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var child = _step5.value;

	                var childLayout = createLayout(child, fontSize);

	                if (child.type === "Operator") {
	                    penX += spaceMetrics.advance;
	                }

	                childLayout.x = penX;
	                penX += childLayout.advance;

	                if (child.type === "Operator") {
	                    penX += spaceMetrics.advance;
	                }
	                layouts.push(childLayout);
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
	                    _iterator5["return"]();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var layout = new Layout(layouts);
	        layout.advance = penX;
	        layout.id = node.id;
	        return layout;
	    } else if (node.type === "Equation") {
	        var penX = 0;

	        var lhs = createLayout(node.left, fontSize);
	        lhs.x = penX;
	        penX += lhs.advance;

	        // TODO: update Equation to handle inequalities
	        var equal = new Glyph("=", fontSize);
	        equal.circle = true;
	        equal.metrics = makeMetricsSquare(equal.metrics);
	        // TODO: figure out how to differentiate between layout and equal node
	        equal.id = node.id;
	        penX += spaceMetrics.advance;
	        equal.x = penX;
	        penX += equal.advance + spaceMetrics.advance;

	        var rhs = createLayout(node.right, fontSize);
	        rhs.x = penX;
	        penX += rhs.advance;

	        var layout = new Layout([lhs, equal, rhs]);
	        layout.advance = penX;
	        layout.id = node.id;
	        return layout;
	    } else if (node.type === "Fraction") {
	        var num = createLayout(node.numerator, fontSize);
	        var den = createLayout(node.denominator, fontSize);

	        // TODO: add Box class to actual render divisior bar
	        // TODO: use x-height / 2 to determine divisor bar position
	        // TODO: use ascender/descender + gap to determine y-shift
	        // TODO: use height of numerator/denominator too
	        num.y -= fontSize / 2 + 0.05 * fontSize;
	        den.y += fontSize / 2 + 0.20 * fontSize;

	        // TODO: calc width so that we can use width where it makes sense
	        if (den.advance > num.advance) {
	            num.x += (den.advance - num.advance) / 2;
	        } else {
	            den.x += (num.advance - den.advance) / 2;
	        }

	        var padding = 0.1 * fontSize;

	        num.x += padding;
	        den.x += padding;

	        var width = Math.max(num.advance, den.advance) + 2 * padding;
	        var thickness = dashMetrics.height;
	        var y = -dashMetrics.bearingY - thickness;
	        var bar = new Box(0, y, width, thickness);

	        var layout = new Layout([num, den, bar]);
	        layout.advance = width;
	        layout.id = node.id;
	        return layout;
	    } else if (node.type === "Product") {
	        var penX = 0;
	        var layouts = [];
	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = node[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var child = _step6.value;

	                // TODO: handle multiple numbers and numbers that come in the middle
	                console.log(child);
	                var childLayout = createLayout(child, fontSize);
	                childLayout.x = penX;
	                penX += childLayout.advance;
	                layouts.push(childLayout);
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
	                    _iterator6["return"]();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        var layout = new Layout(layouts);
	        layout.advance = penX;
	        layout.id = node.id;
	        return layout;
	    }
	}

	function _flatten(layout) {
	    var dx = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var dy = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	    var result = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

	    if (layout.atomic) {
	        layout = layout.clone();
	        layout.x += dx;
	        layout.y += dy;
	        result.push(layout);
	    } else if (layout.children) {
	        dx += layout.x;
	        dy += layout.y;
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;

	        try {
	            for (var _iterator7 = layout.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                var child = _step7.value;

	                _flatten(child, dx, dy, result);
	            }
	        } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
	                    _iterator7["return"]();
	                }
	            } finally {
	                if (_didIteratorError7) {
	                    throw _iteratorError7;
	                }
	            }
	        }
	    } else {
	        var glyph = layout.clone();
	        glyph.x += dx;
	        glyph.y += dy;
	        result.push(glyph);
	    }
	    return result;
	}

	function flatten(layout) {
	    return new Layout(_flatten(layout));
	}

	module.exports = {
	    getMetrics: getMetrics,
	    createLayout: createLayout,
	    flatten: flatten,
	    RenderOptions: RenderOptions
	};

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = {
		"glyphMetrics": {
			"32": {
				"advance": 278,
				"bearingX": 0,
				"bearingY": 0,
				"height": 0,
				"width": 0
			},
			"33": {
				"advance": 333,
				"bearingX": 130,
				"bearingY": 0,
				"height": 720,
				"width": 73
			},
			"34": {
				"advance": 278,
				"bearingX": 57,
				"bearingY": 494,
				"height": 226,
				"width": 163
			},
			"35": {
				"advance": 556,
				"bearingX": 27,
				"bearingY": 0,
				"height": 698,
				"width": 503
			},
			"36": {
				"advance": 556,
				"bearingX": 37,
				"bearingY": -95,
				"height": 861,
				"width": 481
			},
			"37": {
				"advance": 889,
				"bearingX": 67,
				"bearingY": -14,
				"height": 719,
				"width": 754
			},
			"38": {
				"advance": 667,
				"bearingX": 41,
				"bearingY": -19,
				"height": 739,
				"width": 603
			},
			"39": {
				"advance": 222,
				"bearingX": 85,
				"bearingY": 494,
				"height": 226,
				"width": 52
			},
			"40": {
				"advance": 333,
				"bearingX": 55,
				"bearingY": -191,
				"height": 930,
				"width": 222
			},
			"41": {
				"advance": 333,
				"bearingX": 56,
				"bearingY": -191,
				"height": 930,
				"width": 222
			},
			"42": {
				"advance": 389,
				"bearingX": 44,
				"bearingY": 434,
				"height": 286,
				"width": 300
			},
			"43": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 0,
				"height": 500,
				"width": 500
			},
			"44": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": -137,
				"height": 225,
				"width": 73
			},
			"45": {
				"advance": 333,
				"bearingX": 40,
				"bearingY": 229,
				"height": 62,
				"width": 253
			},
			"46": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": 0,
				"height": 88,
				"width": 73
			},
			"47": {
				"advance": 278,
				"bearingX": -3,
				"bearingY": -90,
				"height": 829,
				"width": 291
			},
			"48": {
				"advance": 556,
				"bearingX": 39,
				"bearingY": -14,
				"height": 719,
				"width": 477
			},
			"49": {
				"advance": 556,
				"bearingX": 120,
				"bearingY": 0,
				"height": 705,
				"width": 246
			},
			"50": {
				"advance": 556,
				"bearingX": 48,
				"bearingY": 0,
				"height": 705,
				"width": 467
			},
			"51": {
				"advance": 556,
				"bearingX": 34,
				"bearingY": -14,
				"height": 719,
				"width": 478
			},
			"52": {
				"advance": 556,
				"bearingX": 36,
				"bearingY": 0,
				"height": 698,
				"width": 484
			},
			"53": {
				"advance": 556,
				"bearingX": 35,
				"bearingY": -14,
				"height": 712,
				"width": 471
			},
			"54": {
				"advance": 556,
				"bearingX": 41,
				"bearingY": -14,
				"height": 719,
				"width": 473
			},
			"55": {
				"advance": 556,
				"bearingX": 59,
				"bearingY": 0,
				"height": 698,
				"width": 449
			},
			"56": {
				"advance": 556,
				"bearingX": 44,
				"bearingY": -14,
				"height": 720,
				"width": 468
			},
			"57": {
				"advance": 556,
				"bearingX": 41,
				"bearingY": -14,
				"height": 719,
				"width": 474
			},
			"58": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": 0,
				"height": 492,
				"width": 73
			},
			"59": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": -137,
				"height": 629,
				"width": 73
			},
			"60": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": -6,
				"height": 511,
				"width": 500
			},
			"61": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 124,
				"height": 254,
				"width": 500
			},
			"62": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": -6,
				"height": 511,
				"width": 500
			},
			"63": {
				"advance": 500,
				"bearingX": 34,
				"bearingY": 0,
				"height": 739,
				"width": 438
			},
			"64": {
				"advance": 800,
				"bearingX": 40,
				"bearingY": -19,
				"height": 758,
				"width": 720
			},
			"65": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 720,
				"width": 636
			},
			"66": {
				"advance": 667,
				"bearingX": 81,
				"bearingY": 0,
				"height": 720,
				"width": 529
			},
			"67": {
				"advance": 722,
				"bearingX": 48,
				"bearingY": -19,
				"height": 758,
				"width": 622
			},
			"68": {
				"advance": 722,
				"bearingX": 81,
				"bearingY": 0,
				"height": 720,
				"width": 588
			},
			"69": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 720,
				"width": 489
			},
			"70": {
				"advance": 556,
				"bearingX": 74,
				"bearingY": 0,
				"height": 720,
				"width": 464
			},
			"71": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 758,
				"width": 642
			},
			"72": {
				"advance": 722,
				"bearingX": 80,
				"bearingY": 0,
				"height": 720,
				"width": 562
			},
			"73": {
				"advance": 278,
				"bearingX": 105,
				"bearingY": 0,
				"height": 720,
				"width": 68
			},
			"74": {
				"advance": 500,
				"bearingX": 22,
				"bearingY": -19,
				"height": 739,
				"width": 393
			},
			"75": {
				"advance": 667,
				"bearingX": 85,
				"bearingY": 0,
				"height": 720,
				"width": 564
			},
			"76": {
				"advance": 556,
				"bearingX": 81,
				"bearingY": 0,
				"height": 720,
				"width": 454
			},
			"77": {
				"advance": 833,
				"bearingX": 78,
				"bearingY": 0,
				"height": 720,
				"width": 677
			},
			"78": {
				"advance": 722,
				"bearingX": 79,
				"bearingY": 0,
				"height": 720,
				"width": 563
			},
			"79": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 758,
				"width": 671
			},
			"80": {
				"advance": 611,
				"bearingX": 78,
				"bearingY": 0,
				"height": 720,
				"width": 498
			},
			"81": {
				"advance": 778,
				"bearingX": 48,
				"bearingY": -52,
				"height": 791,
				"width": 671
			},
			"82": {
				"advance": 667,
				"bearingX": 80,
				"bearingY": 0,
				"height": 720,
				"width": 532
			},
			"83": {
				"advance": 611,
				"bearingX": 43,
				"bearingY": -19,
				"height": 758,
				"width": 524
			},
			"84": {
				"advance": 556,
				"bearingX": 16,
				"bearingY": 0,
				"height": 720,
				"width": 524
			},
			"85": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 739,
				"width": 558
			},
			"86": {
				"advance": 611,
				"bearingX": 18,
				"bearingY": 0,
				"height": 720,
				"width": 575
			},
			"87": {
				"advance": 889,
				"bearingX": 14,
				"bearingY": 0,
				"height": 720,
				"width": 861
			},
			"88": {
				"advance": 611,
				"bearingX": 18,
				"bearingY": 0,
				"height": 720,
				"width": 574
			},
			"89": {
				"advance": 611,
				"bearingX": 12,
				"bearingY": 0,
				"height": 720,
				"width": 586
			},
			"90": {
				"advance": 611,
				"bearingX": 31,
				"bearingY": 0,
				"height": 720,
				"width": 548
			},
			"91": {
				"advance": 333,
				"bearingX": 91,
				"bearingY": -191,
				"height": 930,
				"width": 191
			},
			"92": {
				"advance": 278,
				"bearingX": -10,
				"bearingY": -90,
				"height": 829,
				"width": 291
			},
			"93": {
				"advance": 333,
				"bearingX": 51,
				"bearingY": -191,
				"height": 930,
				"width": 191
			},
			"94": {
				"advance": 660,
				"bearingX": 73,
				"bearingY": 245,
				"height": 453,
				"width": 513
			},
			"95": {
				"advance": 500,
				"bearingX": 0,
				"bearingY": -125,
				"height": 50,
				"width": 500
			},
			"96": {
				"advance": 333,
				"bearingX": 45,
				"bearingY": 574,
				"height": 139,
				"width": 189
			},
			"97": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 546,
				"width": 488
			},
			"98": {
				"advance": 611,
				"bearingX": 79,
				"bearingY": -14,
				"height": 734,
				"width": 476
			},
			"99": {
				"advance": 556,
				"bearingX": 47,
				"bearingY": -14,
				"height": 546,
				"width": 461
			},
			"100": {
				"advance": 611,
				"bearingX": 56,
				"bearingY": -14,
				"height": 734,
				"width": 476
			},
			"101": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 546,
				"width": 467
			},
			"102": {
				"advance": 278,
				"bearingX": 20,
				"bearingY": 0,
				"height": 734,
				"width": 237
			},
			"103": {
				"advance": 611,
				"bearingX": 56,
				"bearingY": -212,
				"height": 744,
				"width": 476
			},
			"104": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": 0,
				"height": 720,
				"width": 411
			},
			"105": {
				"advance": 222,
				"bearingX": 78,
				"bearingY": 0,
				"height": 720,
				"width": 66
			},
			"106": {
				"advance": 222,
				"bearingX": 5,
				"bearingY": -204,
				"height": 924,
				"width": 146
			},
			"107": {
				"advance": 500,
				"bearingX": 68,
				"bearingY": 0,
				"height": 720,
				"width": 419
			},
			"108": {
				"advance": 222,
				"bearingX": 81,
				"bearingY": 0,
				"height": 720,
				"width": 60
			},
			"109": {
				"advance": 833,
				"bearingX": 64,
				"bearingY": 0,
				"height": 532,
				"width": 704
			},
			"110": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": 0,
				"height": 532,
				"width": 411
			},
			"111": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 546,
				"width": 480
			},
			"112": {
				"advance": 611,
				"bearingX": 79,
				"bearingY": -204,
				"height": 736,
				"width": 476
			},
			"113": {
				"advance": 611,
				"bearingX": 56,
				"bearingY": -204,
				"height": 736,
				"width": 476
			},
			"114": {
				"advance": 333,
				"bearingX": 75,
				"bearingY": 0,
				"height": 532,
				"width": 231
			},
			"115": {
				"advance": 500,
				"bearingX": 46,
				"bearingY": -14,
				"height": 546,
				"width": 408
			},
			"116": {
				"advance": 278,
				"bearingX": 20,
				"bearingY": -14,
				"height": 676,
				"width": 234
			},
			"117": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 532,
				"width": 411
			},
			"118": {
				"advance": 500,
				"bearingX": 17,
				"bearingY": 0,
				"height": 518,
				"width": 466
			},
			"119": {
				"advance": 722,
				"bearingX": 15,
				"bearingY": 0,
				"height": 518,
				"width": 692
			},
			"120": {
				"advance": 500,
				"bearingX": 18,
				"bearingY": 0,
				"height": 518,
				"width": 463
			},
			"121": {
				"advance": 500,
				"bearingX": 18,
				"bearingY": -204,
				"height": 722,
				"width": 464
			},
			"122": {
				"advance": 500,
				"bearingX": 33,
				"bearingY": 0,
				"height": 518,
				"width": 434
			},
			"123": {
				"advance": 333,
				"bearingX": 45,
				"bearingY": -192,
				"height": 930,
				"width": 234
			},
			"124": {
				"advance": 222,
				"bearingX": 81,
				"bearingY": -250,
				"height": 1000,
				"width": 60
			},
			"125": {
				"advance": 333,
				"bearingX": 51,
				"bearingY": -187,
				"height": 931,
				"width": 234
			},
			"126": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 174,
				"height": 165,
				"width": 500
			},
			"128": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 888,
				"width": 636
			},
			"129": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 979,
				"width": 636
			},
			"130": {
				"advance": 722,
				"bearingX": 48,
				"bearingY": -207,
				"height": 946,
				"width": 622
			},
			"131": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 915,
				"width": 489
			},
			"132": {
				"advance": 722,
				"bearingX": 79,
				"bearingY": 0,
				"height": 890,
				"width": 563
			},
			"133": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 907,
				"width": 671
			},
			"134": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 907,
				"width": 558
			},
			"135": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"136": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"137": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"138": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 700,
				"width": 488
			},
			"139": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 702,
				"width": 488
			},
			"140": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 791,
				"width": 488
			},
			"141": {
				"advance": 556,
				"bearingX": 47,
				"bearingY": -207,
				"height": 739,
				"width": 461
			},
			"142": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"143": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"144": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"145": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 700,
				"width": 467
			},
			"146": {
				"advance": 222,
				"bearingX": 33,
				"bearingY": 0,
				"height": 713,
				"width": 188
			},
			"147": {
				"advance": 222,
				"bearingX": -10,
				"bearingY": 0,
				"height": 713,
				"width": 189
			},
			"148": {
				"advance": 222,
				"bearingX": -52,
				"bearingY": 0,
				"height": 713,
				"width": 294
			},
			"149": {
				"advance": 222,
				"bearingX": -16,
				"bearingY": 0,
				"height": 686,
				"width": 224
			},
			"150": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": 0,
				"height": 688,
				"width": 411
			},
			"151": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"152": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"153": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"154": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 700,
				"width": 480
			},
			"155": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 702,
				"width": 480
			},
			"156": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"157": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"158": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"159": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 700,
				"width": 411
			},
			"160": {
				"advance": 278,
				"bearingX": 0,
				"bearingY": 0,
				"height": 0,
				"width": 0
			},
			"161": {
				"advance": 333,
				"bearingX": 130,
				"bearingY": -187,
				"height": 719,
				"width": 73
			},
			"162": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -141,
				"height": 788,
				"width": 461
			},
			"163": {
				"advance": 556,
				"bearingX": 25,
				"bearingY": -14,
				"height": 719,
				"width": 505
			},
			"164": {
				"advance": 556,
				"bearingX": 27,
				"bearingY": 50,
				"height": 503,
				"width": 502
			},
			"165": {
				"advance": 556,
				"bearingX": 4,
				"bearingY": 0,
				"height": 720,
				"width": 548
			},
			"166": {
				"advance": 222,
				"bearingX": 81,
				"bearingY": -175,
				"height": 850,
				"width": 60
			},
			"167": {
				"advance": 556,
				"bearingX": 48,
				"bearingY": -181,
				"height": 920,
				"width": 460
			},
			"168": {
				"advance": 333,
				"bearingX": 60,
				"bearingY": 584,
				"height": 102,
				"width": 224
			},
			"169": {
				"advance": 800,
				"bearingX": 21,
				"bearingY": -19,
				"height": 758,
				"width": 758
			},
			"170": {
				"advance": 334,
				"bearingX": 8,
				"bearingY": 411,
				"height": 328,
				"width": 317
			},
			"171": {
				"advance": 556,
				"bearingX": 113,
				"bearingY": 117,
				"height": 287,
				"width": 330
			},
			"172": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 112,
				"height": 266,
				"width": 500
			},
			"173": {
				"advance": 333,
				"bearingX": 40,
				"bearingY": 229,
				"height": 62,
				"width": 253
			},
			"174": {
				"advance": 800,
				"bearingX": 21,
				"bearingY": -19,
				"height": 758,
				"width": 758
			},
			"175": {
				"advance": 333,
				"bearingX": 23,
				"bearingY": 612,
				"height": 45,
				"width": 296
			},
			"176": {
				"advance": 400,
				"bearingX": 50,
				"bearingY": 405,
				"height": 300,
				"width": 300
			},
			"177": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 0,
				"height": 500,
				"width": 500
			},
			"178": {
				"advance": 333,
				"bearingX": 15,
				"bearingY": 316,
				"height": 423,
				"width": 303
			},
			"179": {
				"advance": 333,
				"bearingX": 11,
				"bearingY": 308,
				"height": 431,
				"width": 311
			},
			"180": {
				"advance": 333,
				"bearingX": 109,
				"bearingY": 574,
				"height": 139,
				"width": 188
			},
			"181": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -204,
				"height": 722,
				"width": 411
			},
			"182": {
				"advance": 650,
				"bearingX": 66,
				"bearingY": -146,
				"height": 866,
				"width": 440
			},
			"183": {
				"advance": 278,
				"bearingX": 90,
				"bearingY": 301,
				"height": 97,
				"width": 97
			},
			"184": {
				"advance": 333,
				"bearingX": 54,
				"bearingY": -207,
				"height": 207,
				"width": 206
			},
			"185": {
				"advance": 333,
				"bearingX": 87,
				"bearingY": 316,
				"height": 423,
				"width": 160
			},
			"186": {
				"advance": 334,
				"bearingX": 11,
				"bearingY": 411,
				"height": 328,
				"width": 312
			},
			"187": {
				"advance": 556,
				"bearingX": 113,
				"bearingY": 117,
				"height": 287,
				"width": 330
			},
			"188": {
				"advance": 834,
				"bearingX": 40,
				"bearingY": -14,
				"height": 753,
				"width": 754
			},
			"189": {
				"advance": 834,
				"bearingX": 40,
				"bearingY": -14,
				"height": 753,
				"width": 754
			},
			"190": {
				"advance": 834,
				"bearingX": 40,
				"bearingY": -14,
				"height": 753,
				"width": 754
			},
			"191": {
				"advance": 500,
				"bearingX": 28,
				"bearingY": -207,
				"height": 739,
				"width": 438
			},
			"192": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 915,
				"width": 636
			},
			"193": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 915,
				"width": 636
			},
			"194": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 915,
				"width": 636
			},
			"195": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 890,
				"width": 636
			},
			"196": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 888,
				"width": 636
			},
			"197": {
				"advance": 667,
				"bearingX": 15,
				"bearingY": 0,
				"height": 979,
				"width": 636
			},
			"198": {
				"advance": 1000,
				"bearingX": 5,
				"bearingY": 0,
				"height": 720,
				"width": 955
			},
			"199": {
				"advance": 722,
				"bearingX": 48,
				"bearingY": -207,
				"height": 946,
				"width": 622
			},
			"200": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 915,
				"width": 489
			},
			"201": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 915,
				"width": 489
			},
			"202": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 915,
				"width": 489
			},
			"203": {
				"advance": 611,
				"bearingX": 81,
				"bearingY": 0,
				"height": 888,
				"width": 489
			},
			"204": {
				"advance": 278,
				"bearingX": 18,
				"bearingY": 0,
				"height": 915,
				"width": 189
			},
			"205": {
				"advance": 278,
				"bearingX": 61,
				"bearingY": 0,
				"height": 915,
				"width": 188
			},
			"206": {
				"advance": 278,
				"bearingX": -24,
				"bearingY": 0,
				"height": 915,
				"width": 294
			},
			"207": {
				"advance": 278,
				"bearingX": 12,
				"bearingY": 0,
				"height": 888,
				"width": 224
			},
			"208": {
				"advance": 722,
				"bearingX": 10,
				"bearingY": 0,
				"height": 720,
				"width": 659
			},
			"209": {
				"advance": 722,
				"bearingX": 79,
				"bearingY": 0,
				"height": 890,
				"width": 563
			},
			"210": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 934,
				"width": 671
			},
			"211": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 934,
				"width": 671
			},
			"212": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 934,
				"width": 671
			},
			"213": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 909,
				"width": 671
			},
			"214": {
				"advance": 778,
				"bearingX": 53,
				"bearingY": -19,
				"height": 907,
				"width": 671
			},
			"215": {
				"advance": 660,
				"bearingX": 83,
				"bearingY": 6,
				"height": 494,
				"width": 495
			},
			"216": {
				"advance": 778,
				"bearingX": 42,
				"bearingY": -37,
				"height": 784,
				"width": 694
			},
			"217": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 934,
				"width": 558
			},
			"218": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 934,
				"width": 558
			},
			"219": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 934,
				"width": 558
			},
			"220": {
				"advance": 722,
				"bearingX": 82,
				"bearingY": -19,
				"height": 907,
				"width": 558
			},
			"221": {
				"advance": 611,
				"bearingX": 12,
				"bearingY": 0,
				"height": 915,
				"width": 586
			},
			"222": {
				"advance": 611,
				"bearingX": 78,
				"bearingY": 0,
				"height": 720,
				"width": 498
			},
			"223": {
				"advance": 500,
				"bearingX": 52,
				"bearingY": -14,
				"height": 748,
				"width": 407
			},
			"224": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"225": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"226": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 727,
				"width": 488
			},
			"227": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 702,
				"width": 488
			},
			"228": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 700,
				"width": 488
			},
			"229": {
				"advance": 556,
				"bearingX": 46,
				"bearingY": -14,
				"height": 791,
				"width": 488
			},
			"230": {
				"advance": 889,
				"bearingX": 39,
				"bearingY": -14,
				"height": 546,
				"width": 808
			},
			"231": {
				"advance": 556,
				"bearingX": 47,
				"bearingY": -207,
				"height": 739,
				"width": 461
			},
			"232": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"233": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"234": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 727,
				"width": 467
			},
			"235": {
				"advance": 556,
				"bearingX": 45,
				"bearingY": -14,
				"height": 700,
				"width": 467
			},
			"236": {
				"advance": 222,
				"bearingX": -10,
				"bearingY": 0,
				"height": 713,
				"width": 189
			},
			"237": {
				"advance": 222,
				"bearingX": 33,
				"bearingY": 0,
				"height": 713,
				"width": 188
			},
			"238": {
				"advance": 222,
				"bearingX": -52,
				"bearingY": 0,
				"height": 713,
				"width": 294
			},
			"239": {
				"advance": 222,
				"bearingX": -16,
				"bearingY": 0,
				"height": 686,
				"width": 224
			},
			"240": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 753,
				"width": 480
			},
			"241": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": 0,
				"height": 688,
				"width": 411
			},
			"242": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"243": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"244": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 727,
				"width": 480
			},
			"245": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 702,
				"width": 480
			},
			"246": {
				"advance": 556,
				"bearingX": 38,
				"bearingY": -14,
				"height": 700,
				"width": 480
			},
			"247": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 0,
				"height": 500,
				"width": 500
			},
			"248": {
				"advance": 556,
				"bearingX": 35,
				"bearingY": -23,
				"height": 564,
				"width": 486
			},
			"249": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"250": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"251": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 727,
				"width": 411
			},
			"252": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -14,
				"height": 700,
				"width": 411
			},
			"253": {
				"advance": 500,
				"bearingX": 18,
				"bearingY": -204,
				"height": 917,
				"width": 464
			},
			"254": {
				"advance": 611,
				"bearingX": 79,
				"bearingY": -204,
				"height": 924,
				"width": 476
			},
			"884": {
				"advance": 333,
				"bearingX": 109,
				"bearingY": 474,
				"height": 239,
				"width": 188
			},
			"885": {
				"advance": 333,
				"bearingX": 109,
				"bearingY": -276,
				"height": 239,
				"width": 188
			},
			"894": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": -137,
				"height": 629,
				"width": 73
			},
			"900": {
				"advance": 278,
				"bearingX": 102,
				"bearingY": 404,
				"height": 88,
				"width": 73
			},
			"901": {
				"advance": 333,
				"bearingX": 60,
				"bearingY": 584,
				"height": 291,
				"width": 224
			},
			"902": {
				"advance": 650,
				"bearingX": 14,
				"bearingY": 0,
				"height": 714,
				"width": 643
			},
			"903": {
				"advance": 278,
				"bearingX": 90,
				"bearingY": 301,
				"height": 97,
				"width": 97
			},
			"904": {
				"advance": 706,
				"bearingX": 14,
				"bearingY": 0,
				"height": 714,
				"width": 669
			},
			"905": {
				"advance": 817,
				"bearingX": 14,
				"bearingY": 0,
				"height": 714,
				"width": 731
			},
			"906": {
				"advance": 335,
				"bearingX": 14,
				"bearingY": 0,
				"height": 714,
				"width": 244
			},
			"908": {
				"advance": 814,
				"bearingX": 14,
				"bearingY": -14,
				"height": 743,
				"width": 766
			},
			"910": {
				"advance": 784,
				"bearingX": 14,
				"bearingY": 0,
				"height": 714,
				"width": 780
			},
			"911": {
				"advance": 851,
				"bearingX": 14,
				"bearingY": 0,
				"height": 729,
				"width": 807
			},
			"912": {
				"advance": 239,
				"bearingX": -22,
				"bearingY": 0,
				"height": 714,
				"width": 298
			},
			"913": {
				"advance": 630,
				"bearingX": -6,
				"bearingY": 0,
				"height": 714,
				"width": 643
			},
			"914": {
				"advance": 667,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 558
			},
			"915": {
				"advance": 537,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 453
			},
			"916": {
				"advance": 674,
				"bearingX": 13,
				"bearingY": 0,
				"height": 714,
				"width": 649
			},
			"917": {
				"advance": 593,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 498
			},
			"918": {
				"advance": 574,
				"bearingX": 5,
				"bearingY": 0,
				"height": 714,
				"width": 556
			},
			"919": {
				"advance": 704,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 560
			},
			"920": {
				"advance": 741,
				"bearingX": 34,
				"bearingY": -15,
				"height": 744,
				"width": 673
			},
			"921": {
				"advance": 222,
				"bearingX": 77,
				"bearingY": 0,
				"height": 714,
				"width": 68
			},
			"922": {
				"advance": 648,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 590
			},
			"923": {
				"advance": 630,
				"bearingX": -7,
				"bearingY": 0,
				"height": 714,
				"width": 644
			},
			"924": {
				"advance": 833,
				"bearingX": 70,
				"bearingY": 0,
				"height": 714,
				"width": 693
			},
			"925": {
				"advance": 704,
				"bearingX": 71,
				"bearingY": 0,
				"height": 714,
				"width": 562
			},
			"926": {
				"advance": 587,
				"bearingX": 28,
				"bearingY": 0,
				"height": 714,
				"width": 531
			},
			"927": {
				"advance": 741,
				"bearingX": 34,
				"bearingY": -14,
				"height": 743,
				"width": 673
			},
			"928": {
				"advance": 704,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 560
			},
			"929": {
				"advance": 630,
				"bearingX": 72,
				"bearingY": 0,
				"height": 714,
				"width": 529
			},
			"931": {
				"advance": 563,
				"bearingX": 42,
				"bearingY": 0,
				"height": 714,
				"width": 498
			},
			"932": {
				"advance": 556,
				"bearingX": -4,
				"bearingY": 0,
				"height": 714,
				"width": 565
			},
			"933": {
				"advance": 611,
				"bearingX": -9,
				"bearingY": 0,
				"height": 714,
				"width": 630
			},
			"934": {
				"advance": 741,
				"bearingX": 21,
				"bearingY": 0,
				"height": 744,
				"width": 698
			},
			"935": {
				"advance": 574,
				"bearingX": -11,
				"bearingY": 0,
				"height": 714,
				"width": 595
			},
			"936": {
				"advance": 785,
				"bearingX": 65,
				"bearingY": 0,
				"height": 714,
				"width": 655
			},
			"937": {
				"advance": 725,
				"bearingX": 53,
				"bearingY": 0,
				"height": 704,
				"width": 619
			},
			"938": {
				"advance": 222,
				"bearingX": -11,
				"bearingY": 0,
				"height": 904,
				"width": 244
			},
			"939": {
				"advance": 611,
				"bearingX": -9,
				"bearingY": 0,
				"height": 904,
				"width": 630
			},
			"940": {
				"advance": 592,
				"bearingX": 38,
				"bearingY": -15,
				"height": 729,
				"width": 545
			},
			"941": {
				"advance": 504,
				"bearingX": 36,
				"bearingY": -15,
				"height": 729,
				"width": 443
			},
			"942": {
				"advance": 537,
				"bearingX": 59,
				"bearingY": -191,
				"height": 905,
				"width": 419
			},
			"943": {
				"advance": 190,
				"bearingX": 38,
				"bearingY": 0,
				"height": 714,
				"width": 143
			},
			"944": {
				"advance": 522,
				"bearingX": 59,
				"bearingY": -15,
				"height": 729,
				"width": 429
			},
			"945": {
				"advance": 592,
				"bearingX": 38,
				"bearingY": -15,
				"height": 546,
				"width": 545
			},
			"946": {
				"advance": 545,
				"bearingX": 61,
				"bearingY": -191,
				"height": 920,
				"width": 450
			},
			"947": {
				"advance": 463,
				"bearingX": 4,
				"bearingY": -191,
				"height": 707,
				"width": 454
			},
			"948": {
				"advance": 556,
				"bearingX": 33,
				"bearingY": -15,
				"height": 746,
				"width": 488
			},
			"949": {
				"advance": 504,
				"bearingX": 36,
				"bearingY": -15,
				"height": 546,
				"width": 443
			},
			"950": {
				"advance": 438,
				"bearingX": 34,
				"bearingY": -154,
				"height": 868,
				"width": 399
			},
			"951": {
				"advance": 537,
				"bearingX": 59,
				"bearingY": -191,
				"height": 722,
				"width": 419
			},
			"952": {
				"advance": 574,
				"bearingX": 43,
				"bearingY": -15,
				"height": 744,
				"width": 488
			},
			"953": {
				"advance": 190,
				"bearingX": 61,
				"bearingY": 0,
				"height": 516,
				"width": 120
			},
			"954": {
				"advance": 500,
				"bearingX": 60,
				"bearingY": 0,
				"height": 516,
				"width": 448
			},
			"955": {
				"advance": 480,
				"bearingX": 4,
				"bearingY": 0,
				"height": 724,
				"width": 467
			},
			"956": {
				"advance": 556,
				"bearingX": 72,
				"bearingY": -204,
				"height": 722,
				"width": 411
			},
			"957": {
				"advance": 471,
				"bearingX": 2,
				"bearingY": 0,
				"height": 516,
				"width": 459
			},
			"958": {
				"advance": 445,
				"bearingX": 45,
				"bearingY": -154,
				"height": 885,
				"width": 385
			},
			"959": {
				"advance": 556,
				"bearingX": 34,
				"bearingY": -14,
				"height": 545,
				"width": 488
			},
			"960": {
				"advance": 561,
				"bearingX": 11,
				"bearingY": 0,
				"height": 514,
				"width": 528
			},
			"961": {
				"advance": 574,
				"bearingX": 60,
				"bearingY": -191,
				"height": 722,
				"width": 476
			},
			"962": {
				"advance": 519,
				"bearingX": 34,
				"bearingY": -154,
				"height": 685,
				"width": 453
			},
			"963": {
				"advance": 569,
				"bearingX": 34,
				"bearingY": -15,
				"height": 531,
				"width": 522
			},
			"964": {
				"advance": 441,
				"bearingX": 7,
				"bearingY": 0,
				"height": 516,
				"width": 428
			},
			"965": {
				"advance": 522,
				"bearingX": 59,
				"bearingY": -15,
				"height": 531,
				"width": 429
			},
			"966": {
				"advance": 659,
				"bearingX": 34,
				"bearingY": -191,
				"height": 857,
				"width": 591
			},
			"967": {
				"advance": 463,
				"bearingX": -18,
				"bearingY": -191,
				"height": 707,
				"width": 494
			},
			"968": {
				"advance": 630,
				"bearingX": 59,
				"bearingY": -191,
				"height": 857,
				"width": 537
			},
			"969": {
				"advance": 721,
				"bearingX": 34,
				"bearingY": -15,
				"height": 531,
				"width": 653
			},
			"970": {
				"advance": 222,
				"bearingX": -11,
				"bearingY": 0,
				"height": 706,
				"width": 244
			},
			"971": {
				"advance": 522,
				"bearingX": 59,
				"bearingY": -15,
				"height": 721,
				"width": 429
			},
			"972": {
				"advance": 556,
				"bearingX": 34,
				"bearingY": -14,
				"height": 728,
				"width": 488
			},
			"973": {
				"advance": 522,
				"bearingX": 59,
				"bearingY": -15,
				"height": 729,
				"width": 429
			},
			"974": {
				"advance": 721,
				"bearingX": 34,
				"bearingY": -15,
				"height": 729,
				"width": 653
			},
			"8706": {
				"advance": 537,
				"bearingX": 44,
				"bearingY": -10,
				"height": 783,
				"width": 441
			},
			"8710": {
				"advance": 646,
				"bearingX": 33,
				"bearingY": 0,
				"height": 712,
				"width": 580
			},
			"8719": {
				"advance": 692,
				"bearingX": 26,
				"bearingY": -96,
				"height": 788,
				"width": 639
			},
			"8721": {
				"advance": 552,
				"bearingX": 23,
				"bearingY": -96,
				"height": 788,
				"width": 505
			},
			"8722": {
				"advance": 660,
				"bearingX": 80,
				"bearingY": 220,
				"height": 60,
				"width": 500
			},
			"8725": {
				"advance": 167,
				"bearingX": -164,
				"bearingY": -14,
				"height": 719,
				"width": 495
			},
			"8729": {
				"advance": 278,
				"bearingX": 90,
				"bearingY": 301,
				"height": 97,
				"width": 97
			},
			"8730": {
				"advance": 564,
				"bearingX": 35,
				"bearingY": -151,
				"height": 971,
				"width": 527
			},
			"8734": {
				"advance": 774,
				"bearingX": 52,
				"bearingY": 134,
				"height": 304,
				"width": 670
			},
			"8747": {
				"advance": 344,
				"bearingX": 11,
				"bearingY": -156,
				"height": 999,
				"width": 318
			},
			"8776": {
				"advance": 568,
				"bearingX": 48,
				"bearingY": 143,
				"height": 280,
				"width": 470
			},
			"8800": {
				"advance": 568,
				"bearingX": 52,
				"bearingY": 47,
				"height": 467,
				"width": 463
			},
			"8804": {
				"advance": 568,
				"bearingX": 52,
				"bearingY": 10,
				"height": 576,
				"width": 463
			},
			"8805": {
				"advance": 568,
				"bearingX": 53,
				"bearingY": 10,
				"height": 576,
				"width": 461
			}
		},
		"unitsPerEm": 1000
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.removeExtraParens = removeExtraParens;
	exports.add = add;
	exports.sub = sub;
	exports.mul = mul;
	exports.div = div;

	var _require = __webpack_require__(1);

	var Expression = _require.Expression;
	var Product = _require.Product;
	var Fraction = _require.Fraction;
	var Operator = _require.Operator;
	var Identifier = _require.Identifier;
	var Literal = _require.Literal;
	var Equation = _require.Equation;

	function removeExtraParens(expr) {
	    if (expr.type !== 'Expression') {
	        return expr;
	    }

	    var removalList = [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = expr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var child = _step.value;

	            if (child.type === 'Expression') {
	                if (child.prev == null || child.prev.operator === '+') {
	                    removalList.push(child);
	                }
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

	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	        for (var _iterator2 = removalList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var removal = _step2.value;
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = removal[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var child = _step3.value;

	                    child.parent = expr;
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                        _iterator3['return']();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }

	            removal.first.prev = removal.prev;
	            removal.last.next = removal.next;
	            if (removal.prev === null) {
	                expr.first = removal.first;
	            } else {
	                removal.prev.next = removal.first;
	            }
	            if (removal.next === null) {
	                expr.last = removal.last;
	            } else {
	                removal.next.prev = removal.last;
	            }
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

	    return expr;
	}

	function removeExtraProductParens(prod) {
	    var removalList = [];
	    var _iteratorNormalCompletion4 = true;
	    var _didIteratorError4 = false;
	    var _iteratorError4 = undefined;

	    try {
	        for (var _iterator4 = prod[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var child = _step4.value;

	            if (child.type === 'Product') {
	                removalList.push(child);
	            }
	        }
	    } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                _iterator4['return']();
	            }
	        } finally {
	            if (_didIteratorError4) {
	                throw _iteratorError4;
	            }
	        }
	    }

	    var _iteratorNormalCompletion5 = true;
	    var _didIteratorError5 = false;
	    var _iteratorError5 = undefined;

	    try {
	        for (var _iterator5 = removalList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	            var removal = _step5.value;
	            var _iteratorNormalCompletion6 = true;
	            var _didIteratorError6 = false;
	            var _iteratorError6 = undefined;

	            try {
	                for (var _iterator6 = removal[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                    var child = _step6.value;

	                    child.parent = prod;
	                }
	            } catch (err) {
	                _didIteratorError6 = true;
	                _iteratorError6 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion6 && _iterator6['return']) {
	                        _iterator6['return']();
	                    }
	                } finally {
	                    if (_didIteratorError6) {
	                        throw _iteratorError6;
	                    }
	                }
	            }

	            removal.first.prev = removal.prev;
	            removal.last.next = removal.next;
	            if (removal.prev === null) {
	                prod.first = removal.first;
	            } else {
	                removal.prev.next = removal.first;
	            }
	            if (removal.next === null) {
	                prod.last = removal.last;
	            } else {
	                removal.next.prev = removal.last;
	            }
	        }
	    } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	                _iterator5['return']();
	            }
	        } finally {
	            if (_didIteratorError5) {
	                throw _iteratorError5;
	            }
	        }
	    }

	    return prod;
	}

	function add(a, b) {
	    if (a.type === 'Equation' && b.type === 'Equation') {
	        return new Equation(add(a.left, b.left), add(a.right, b.right));
	    } else if (a.type === 'Equation' && b.type !== 'Equation') {
	        return new Equation(add(a.left, b.clone()), add(a.right, b.clone()));
	    } else if (a.type !== 'Equation' && b.type === 'Equation') {
	        return new Equation(add(a.clone(), b.left), add(a.clone(), b.right));
	    } else {
	        return removeExtraParens(new Expression(a, new Operator('+'), b));
	    }
	}

	function sub(a, b) {
	    if (a.type === 'Equation' && b.type === 'Equation') {
	        return new Equation(sub(a.left, b.left), sub(a.right, b.right));
	    } else if (a.type === 'Equation' && b.type !== 'Equation') {
	        return new Equation(sub(a.left, b), sub(a.right, b));
	    } else if (a.type !== 'Equation' && b.type === 'Equation') {
	        return new Equation(sub(a, b.left), sub(a, b.right));
	    } else {
	        return removeExtraParens(new Expression(a, new Operator('-'), b));
	    }
	}

	function mul(a, b) {
	    if (a.type === 'Equation' && b.type === 'Equation') {
	        throw new Error("can't multiply two equations");
	    } else if (a.type === 'Equation' && b.type !== 'Equation') {
	        return new Equation(mul(a.left, b), mul(a.right, b));
	    } else if (a.type !== 'Equation' && b.type === 'Equation') {
	        return new Equation(mul(a, b.left), mul(a, b.right));
	    } else {
	        return removeExtraProductParens(new Product(a, new Operator('*'), b));
	    }
	}

	function div(a, b) {
	    if (a.type === 'Equation' && b.type === 'Equation') {
	        throw new Error("can't divide two equations");
	    } else if (a.type === 'Equation' && b.type !== 'Equation') {
	        return new Equation(div(a.left, b), div(a.right, b));
	    } else if (a.type !== 'Equation' && b.type === 'Equation') {
	        return new Equation(div(a, b.left), div(a, b.right));
	    } else {
	        return new Fraction(a, b);
	    }
	}

/***/ }
/******/ ]);
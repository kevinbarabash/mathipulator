const React = require('react');

const { Component } = React;
const { Expression, Operator } = require("../ast.js");
const MathRenderer = require('./math-renderer.js');
const Parser = require('../parser.js');
const { add, sub, mul, div } = require('../operations.js');
const { findNode, deepEqual } = require('../util/node_utils.js');

class App extends Component {
    constructor() {
        super();

        this.parser = new Parser();

        //const math = this.parser.parse('1/x+1/y');
        //const math = this.parser.parse('(-(2x+5))=10');
        const math = this.parser.parse('a = -1*-a');

        this.state = {
            menu: null,
            math: math,
            history: [],
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleReplace = this.handleReplace.bind(this);
        this.handlePerform = this.handlePerform.bind(this);
    }

    handleClick(id, transform) {
        const { math, history } = this.state;
        const nextMath = math.clone();
        const node = findNode(nextMath, id);

        if (node && transform && transform.canTransform(node)) {
            transform.doTransform(node);
            history.push(math);
            this.setState({ math: nextMath, history });
        }
    }

    handleReplace() {
        const text = this.refs.replaceText.value;
        let math = this.parser.parse(text);
        this.setState({ math, history: [] });
    }

    handlePerform() {
        const text = this.refs.performText.value;
        const root = this.state.math.root;

        if (root.type === 'Equation') {
            this.performEquationAction(text);
        } else {
            this.performExpressionAction(text);
        }
    }

    performEquationAction(text) {
        if (['+', '-', '*', '/'].includes(text[0])) {
            const { history } = this.state;
            history.push(this.state.math);

            const expr1 = this.parser.parse(text.substring(1)).root;
            const expr2 = this.parser.parse(text.substring(1)).root;
            const op = text[0];
            const math = this.state.math.clone();
            const root = math.root;

            if (op === '+') {
                root.left = add(root.left, expr1);
                root.right = add(root.right, expr2);
            } else if (op === '-') {
                root.left = sub(root.left, expr1);
                root.right = sub(root.right, expr2);
            } else if (op === '*') {
                root.left = mul(root.left, expr1);
                root.right = mul(root.right, expr2);
            } else if (op === '/') {
                root.left = div(root.left, expr1);
                root.right = div(root.right, expr2);
            } else {
                return;
            }

            math.root = root;
            this.setState({ math, history });

        } else if  (['+', '-', '*', '/'].includes(text[text.length - 1])) {
            const { history } = this.state;
            history.push(this.state.math);

            const expr1 = this.parser.parse(text.substring(0, text.length - 1));
            const expr2 = this.parser.parse(text.substring(0, text.length - 1));
            const op = text[text.length - 1];
            const math = this.state.math.clone();
            const root = math.root;

            if (op === '+') {
                root.left = add(expr1, root.left);
                root.right = add(expr2, root.right);
            } else if (op === '-') {
                root.left = sub(expr1, root.left);
                root.right = sub(expr2, root.right);
            } else if (op === '*') {
                root.left = mul(expr1, root.left);
                root.right = mul(expr2, root.right);
            } else if (op === '/') {
                root.left = div(expr1, root.left);
                root.right = div(expr2, root.right);
            } else {
                return;
            }

            math.root = root;
            this.setState({ math, history });
        }
    }

    performExpressionAction(text) {
        const { history } = this.state;
        const { renderer } = this.refs;
        const { selectedNode } = renderer.state;

        if (['+', '-'].includes(text[0])) {
            const expr = this.parser.parse(text.substring(1)).root;
            const math = this.state.math.clone();

            // TODO: handle +x+(-x)
            if (expr.type === 'Expression' && expr.length === 3 &&
                ['+', '-'].includes(expr.first.next.operator) &&
                text[0] !== expr.first.next.operator) {

                const { first, last } = expr;

                if (deepEqual(first, last)) {
                    history.push(this.state.math);
                    if (selectedNode) {
                        const node = findNode(math, selectedNode.id);
                        if (text[0] === '+') {
                            node.parent.replace(node, add(node.clone(), expr));
                        } else if (text[0] === '-') {
                            node.parent.replace(node, sub(node.clone(), expr))
                        }
                    } else {
                        if (text[0] === '+') {
                            math.replace(math.root, add(math.root, expr));
                        } else if (text[0] === '-') {
                            math.replace(math.root, sub(math.root, expr))
                        }
                    }
                    this.setState({math, history});
                }
            }
        } else if ('*' === text[0]) {
            const frac = this.parser.parse(text.substring(1)).root;
            const math = this.state.math.clone();

            if (frac.type === 'Fraction' && deepEqual(frac.numerator, frac.denominator)) {
                history.push(this.state.math);
                if (selectedNode) {
                    const node = findNode(math, selectedNode.id);
                    node.parent.replace(node, mul(node.clone(), frac));
                    renderer.setState({menu: null});
                } else {
                    math.replace(math.root, mul(math.root, frac));
                }
                this.setState({math, history});
            }

            console.log(this.refs['renderer'].state.selectedNode);
        }
    }

    render() {
        const { menu, math, history } = this.state;

        const buttonStyle = {
            marginLeft: 10,
            fontSize: 20,
            borderRadius: 5,
            border: 'solid 1px #999',
            backgroundColor: '#CCC',
        };

        const containerStyle = {
            position:'absolute',
            padding:20,
            bottom:20,
            width:'100%',
            boxSizing:'border-box'
        };

        return <div style={styles.app}>
            <MathRenderer
                ref='renderer'
                color={'black'}
                fontSize={60}
                math={math}
                history={history}
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={this.handleClick}
            />
            {menu}
            <div style={containerStyle}>
                <div style={{float:'left'}}>
                    <input type="text" style={{fontSize:20}} ref="replaceText"/>
                    <button onClick={this.handleReplace} style={buttonStyle}>
                        Replace
                    </button>
                </div>
                <div style={{float:'right'}}>
                    <input type="text" style={{fontSize:20}} ref="performText"/>
                    <button onClick={this.handlePerform} style={buttonStyle}>
                        Perform
                    </button>
                </div>
            </div>
        </div>;
    }
}

const styles = {
    app: {
        height: '100vh',
        width: '100vw'
    }
};

module.exports = App;

const React = require('react');

const { Component } = React;
const { Literal } = require("../ast.js");
const MathRenderer = require('./math-renderer.js');
const Parser = require('../parser.js');
const { add, sub, mul, div } = require('../operations.js');
const { findNode, compare } = require('../util/node_utils.js');

const opDict = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div
};

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
        const { history } = this.state;

        if (['+', '-', '*', '/'].includes(text[0])) {
            history.push(this.state.math);

            const expr1 = this.parser.parse(text.substring(1)).root;
            const expr2 = this.parser.parse(text.substring(1)).root;
            const math = this.state.math.clone();
            const root = math.root;

            const op = opDict[text[0]];

            root.left = op(root.left, expr1);
            root.right = op(root.right, expr2);

            root.left.parent = root;
            root.right.parent = root;

            math.root = root;
            this.setState({ math, history });
        } else if  (['+', '-', '*', '/'].includes(text[text.length - 1])) {
            history.push(this.state.math);

            const expr1 = this.parser.parse(text.substring(0, text.length - 1)).root;
            const expr2 = this.parser.parse(text.substring(0, text.length - 1)).root;
            const math = this.state.math.clone();
            const root = math.root;

            const op = opDict[text[text.length - 1]];

            root.left = op(expr1, root.left);
            root.right = op(expr2, root.right);

            root.left.parent = root;
            root.right.parent = root;

            math.root = root;
            console.log(root);
            this.setState({ math, history });
        }
    }

    performExpressionAction(text) {
        const { history } = this.state;
        const { renderer } = this.refs;
        const { selectedNode } = renderer.state;

        const op = opDict[text[0]];

        const expr = this.parser.parse(text.substring(1)).root;
        const math = this.state.math.clone();

        // TODO: handle -x+x
        if (['+', '-'].includes(text[0]) && compare(expr, new Literal(0))) {
            history.push(this.state.math);
            const node = selectedNode ? findNode(math, selectedNode.id) : math.root;
            node.parent.replace(node, op(node.clone(), expr));
            this.setState({math, history, menu: null});
        } else if (['*', '/'].includes(text[0]) && compare(expr, new Literal(1))) {
            history.push(this.state.math);
            const node = selectedNode ? findNode(math, selectedNode.id) : math.root;
            node.parent.replace(node, op(node.clone(), expr));
            this.setState({math, history});
        }

        renderer.setState({menu: null});
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

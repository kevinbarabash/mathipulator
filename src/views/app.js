const React = require('react');

const { Component } = React;

const MathRenderer = require('./math-renderer.js');
const Parser = require('../parser.js');
const { Literal, Equation, Identifier, Negation } = require('../ast.js');
const { add, sub, mul, div } = require('../operations.js');
const { findNode } = require('../util/node_utils.js');

class App extends Component {
    constructor() {
        super();

        //const expr1 = sub(
        //    new Identifier('x'),
        //    new Literal(0)
        //);

        //const expr1 = add(
        //    mul(new Literal(2), add(new Identifier('x'), new Literal(1))),
        //    div(new Literal(1), sub(new Identifier('x'), new Literal(2)))
        //);

        const expr1 = div(
            add(new Literal(3), new Literal(5)),
            new Literal(2)
        );

        //const expr1 = mul(new Literal(2), add(new Identifier('x'), new Literal(1)));

        const expr2 = new Literal(5);

        const math = new Equation(expr1, expr2);

        this.state = {
            menu: null,
            math: math,
            history: [],
        };

        this.parser = new Parser();

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
        const math = this.parser.parse(text);
        this.setState({ math, history: [] });
    }

    handlePerform() {
        const text = this.refs.performText.value;

        if (['+', '-', '*', '/'].includes(text[0])) {
            // TODO: check that it isn't an equation
            const expr1 = this.parser.parse(text.substring(1));
            const expr2 = this.parser.parse(text.substring(1));
            const op = text[0];
            const math = this.state.math.clone();

            // TODO: check that `math` isn't an equation

            if (op === '+') {
                math.left = add(math.left, expr1);
                math.right = add(math.right, expr2);
                this.setState({ math });
            } else if (op === '-') {
                math.left = sub(math.left, expr1);
                math.right = sub(math.right, expr2);
                this.setState({ math });
            } else if (op === '*') {
                math.left = mul(math.left, expr1);
                math.right = mul(math.right, expr2);
                this.setState({ math });
            } else if (op === '/') {
                math.left = div(math.left, expr1);
                math.right = div(math.right, expr2);
                this.setState({ math });
            }
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

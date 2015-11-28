const React = require('react');

const { Component } = React;

const MathRenderer = require('./math-renderer.js');
const { Literal, Equation, Identifier } = require('../ast.js');
const { add, sub, mul, div } = require('../operations.js');
const { findNode } = require('../util/node_utils.js');

class App extends Component {
    constructor() {
        super();

        const expr1 = mul(
            new Literal(2),
            add(
                new Literal(3),
                mul(
                    new Literal(5),
                    new Literal(-4)
                )
            )
        );

        const expr2 = div(
            sub(
                mul(
                    new Literal(1.5),
                    new Literal(-3)
                ),
                new Identifier('y')
            ),
            sub(add(new Literal(1), new Literal(2)), new Literal(3))
        );

        const math = new Equation(expr1, expr2);

        this.state = {
            menu: null,
            math: math
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id, transform) {
        const {math} = this.state;
        const nextMath = math.clone();
        const node = findNode(nextMath, id);

        if (node && transform && transform.canTransform(node)) {
            transform.doTransform(node);
            this.setState({math: nextMath});
        }
    }

    render() {
        const {menu} = this.state;

        return <div style={styles.app}>
            <MathRenderer
                color={'black'}
                fontSize={48}
                math={this.state.math}
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={this.handleClick}
            />
            {menu}
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

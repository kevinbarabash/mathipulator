const React = require('react');

const { Component } = React;

const MathRenderer = require('./math-renderer.js');
const { Literal, Equation, Identifier, Negation } = require('../ast.js');
const { add, sub, mul, div } = require('../operations.js');
const { findNode } = require('../util/node_utils.js');

class App extends Component {
    constructor() {
        super();

        const expr1 = sub(
            new Identifier('x'),
            new Literal(0)
        );

        //const expr1 = add(
        //    mul(new Literal(2), add(new Identifier('x'), new Literal(1))),
        //    mul(new Literal(2), add(new Identifier('x'), new Literal(1)))
        //);

        const expr2 = new Literal(5);

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
            console.log(nextMath);
            this.setState({math: nextMath});
        }
    }

    render() {
        const {menu} = this.state;

        return <div style={styles.app}>
            <MathRenderer
                color={'black'}
                fontSize={60}
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

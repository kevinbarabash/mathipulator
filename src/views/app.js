const React = require('react');

const { Component } = React;

const MathRenderer = require('./math-renderer.js');
const { Literal, Equation } = require('../ast.js');
const { add, sub, mul, div } = require('../operations.js');

class App extends Component {
    render() {
        let expr1, expr2, eqn1;

        expr1 = mul(new Literal(2), add(new Literal(3), mul(new Literal(5), new Literal(-4))));
        expr2 = div(sub(mul(new Literal(1.5), new Literal(-3)), new Literal(12)), new Literal(15));

        eqn1 = new Equation(expr1, expr2);

        return <div style={styles.app}>
            <MathRenderer
                color={'black'}
                fontSize={48}
                expression={eqn1}
                width={window.innerWidth}
                height={window.innerHeight}
            />
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

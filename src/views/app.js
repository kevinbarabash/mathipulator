const React = require('react');

const { Component } = React;
const { Literal } = require('../ast.js');
const History = require('./history.js');
const MathRenderer = require('./math-renderer.js');
const HistoryRenderer = require('./history-renderer.js');
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

        const history = new History();
        history.addStep(this.parser.parse('(10xy)/(2x)'));

        this.state = {
            menu: null,
            history,
            view: 'edit',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleReplace = this.handleReplace.bind(this);
        this.handlePerform = this.handlePerform.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleHistory = this.handleHistory.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleClick(id, transform) {
        const history = this.state.history.clone();
        const math = history.getCurrentStep();
        const nextMath = math.clone();
        const node = findNode(nextMath, id);

        if (node && transform && transform.canTransform(node)) {
            // the transform updates nextMath
            transform.doTransform(node);
            history.addStep(nextMath);
            this.setState({ history });
        }
    }

    handleUndo() {
        const { history } = this.state;
        if (history.current > 0) {
            const clone = history.clone();
            clone.backward();
            this.setState({ history: clone });
        }
    }

    handleRedo() {
        const { history } = this.state;
        if (history.current < history.length - 1) {
            const clone = history.clone();
            clone.forward();
            this.setState({ history: clone });
        }
    }

    handleReplace() {
        const text = this.refs.replaceText.value;
        let math = this.parser.parse(text);
        const history = new History();
        history.addStep(math);
        this.setState({ history });
    }

    handlePerform() {
        const text = this.refs.performText.value;
        const { history } = this.state;
        const root = history.getCurrentStep().root;
        const { renderer } = this.refs;
        const { selectedNode } = renderer.state;

        if (!selectedNode && root.type === 'Equation') {
            this.performEquationAction(text);
        } else {
            this.performExpressionAction(text);
        }
    }

    handleHistory() {
        this.setState({ view: 'history' });
    }

    handleEdit() {
        this.setState({ view: 'edit' });
    }

    performEquationAction(text) {
        const history = this.state.history.clone();
        const math = history.getCurrentStep().clone();

        if (['+', '-', '*', '/'].includes(text[0])) {
            const expr1 = this.parser.parse(text.substring(1)).root;
            const expr2 = this.parser.parse(text.substring(1)).root;
            const root = math.root;

            const op = opDict[text[0]];

            root.left = op(root.left, expr1);
            root.right = op(root.right, expr2);

            root.left.parent = root;
            root.right.parent = root;

            math.root = root;

            history.addStep(math);
            this.setState({ math, history });
        } else if  (['+', '-', '*', '/'].includes(text[text.length - 1])) {
            const expr1 = this.parser.parse(text.substring(0, text.length - 1)).root;
            const expr2 = this.parser.parse(text.substring(0, text.length - 1)).root;
            const root = math.root;

            const op = opDict[text[text.length - 1]];

            root.left = op(expr1, root.left);
            root.right = op(expr2, root.right);

            root.left.parent = root;
            root.right.parent = root;

            math.root = root;

            history.addStep(math);
            this.setState({ math, history });
        }
    }

    performExpressionAction(text) {
        const history = this.state.history.clone();
        const { renderer } = this.refs;
        const { selectedNode } = renderer.state;

        const op = opDict[text[0]];

        const expr = this.parser.parse(text.substring(1)).root;
        const math = history.getCurrentStep();

        // TODO: handle -x+x
        if (['+', '-'].includes(text[0]) && compare(expr, new Literal(0))) {
            const node = selectedNode ? findNode(math, selectedNode.id) : math.root;
            node.parent.replace(node, op(node.clone(), expr));
            history.addStep(math);
            this.setState({history, menu: null});
        } else if (['*', '/'].includes(text[0]) && compare(expr, new Literal(1))) {
            const node = selectedNode ? findNode(math, selectedNode.id) : math.root;
            node.parent.replace(node, op(node.clone(), expr));
            history.addStep(math);
            this.setState({math, history});
        }

        renderer.setState({menu: null});
    }

    render() {
        const { menu, history, view } = this.state;

        const math = history.getCurrentStep();

        const buttonStyle = {
            marginLeft: 10,
            fontSize: 20,
            borderRadius: 5,
            border: 'solid 1px #999',
            backgroundColor: '#CCC',
        };

        const topContainer = {
            position:'absolute',
            padding:20,
            top:20,
            width:'100%',
            boxSizing:'border-box',
            display:'flex',
            flexDirection:'row',
        };

        const bottomContainer = {
            position:'absolute',
            padding:20,
            bottom:20,
            width:'100%',
            boxSizing:'border-box',
            display:'flex',
            flexDirection:'row',
        };

        return <div style={styles.app}>
            {view === 'edit' &&
                <MathRenderer
                    ref='renderer'
                    color={'black'}
                    fontSize={60}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onClick={this.handleClick}
                    math={math}
                />}
            {view === 'history' &&
                <HistoryRenderer
                    color={'black'}
                    fontSize={60}
                    history={history}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />}
            {menu}
            <div style={topContainer}>
                <span>
                    <button
                        onClick={this.handleUndo}
                        style={buttonStyle}
                        disabled={!history.canUndo()}
                    >
                        Undo
                    </button>
                </span>
                <span style={{textAlign: 'center', flexGrow:1}}>
                    {view === 'edit' &&
                        <button
                            onClick={this.handleHistory}
                            style={buttonStyle}
                        >
                            History
                        </button>}
                    {view === 'history' &&
                        <button
                            onClick={this.handleEdit}
                            style={buttonStyle}
                        >
                            Edit
                        </button>}
                </span>
                <span>
                    <button
                        onClick={this.handleRedo}
                        style={buttonStyle}
                        disabled={!history.canRedo()}
                    >
                        Redo
                    </button>
                </span>
            </div>
            <div style={bottomContainer}>
                <span>
                    <input type="text" style={{fontSize:20}} ref="replaceText"/>
                    <button onClick={this.handleReplace} style={buttonStyle}>
                        Replace
                    </button>
                </span>
                <span style={{textAlign: 'center', flexGrow:1}}>

                </span>
                <span>
                    <input type="text" style={{fontSize:20}} ref="performText"/>
                    <button onClick={this.handlePerform} style={buttonStyle}>
                        Perform
                    </button>
                </span>
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

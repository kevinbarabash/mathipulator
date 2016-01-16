const React = require('react');

const { Component } = React;
const { Literal } = require('../ast.js');
const History = require('./history.js');
const MathRenderer = require('./math-renderer.js');
const HistoryRenderer = require('./history-renderer.js');
const Parser = require('../parser.js');
const Selection = require('./selection.js');
const Modal = require('./modal.js');
const StaticMath = require('./static-math.js');
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

        const params = {};

        location.search.substring(1).split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });

        if (params.start) {
            history.addStep(this.parser.parse(params.start));
        } else {
            history.addStep(this.parser.parse('2x + 5 = 10'));
        }

        let goal = null;

        if (params.finish) {
            goal = this.parser.parse(params.finish);
        }

        this.state = {
            goal,
            history,
            modal: null,
            view: 'edit'
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleReplace = this.handleReplace.bind(this);
        this.handlePerform = this.handlePerform.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleHistory = this.handleHistory.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleClick(selections, transform, completionCallback) {
        const history = this.state.history.clone();
        const math = history.getCurrentStep();
        const nextMath = math.clone();

        // Selections in `selections` point nodes in math not nextMath so we
        // need to find the corresponding nodes in nextMath before we pass the
        // selection(s) to the transforms.
        const newSelections = selections.map(selection => {
            const first = findNode(nextMath, selection.first.id);
            const last = findNode(nextMath, selection.last.id);
            return new Selection(first, last);
        });

        if (newSelections.length === 1) {
            if (transform && transform.canTransform(newSelections[0])) {
                if (transform.needsUserInput) {

                    const mathToReplace = newSelections[0].toExpression();

                    const callback = (newMath) => {
                        if (newMath) {
                            transform.doTransform(newSelections[0], newMath);
                            history.addStep(nextMath);
                            this.setState({ history, modal: null });
                        } else {
                            this.setState({ modal: null });
                        }
                        completionCallback();
                    };

                    const modal = <Modal
                        math={mathToReplace}
                        callback={callback}
                        validateInput={transform.validateInput}
                    />;

                    this.setState({ modal });

                } else {
                    // the transform updates nextMath
                    transform.doTransform(newSelections[0]);
                    history.addStep(nextMath);
                    this.setState({ history });
                    completionCallback();
                }
            }
        } else if (transform.hasOwnProperty('canTransformNodes') && transform.canTransformNodes(newSelections)) {
            if (transform.needsUserInput) {

                const callback = (newMath) => {
                    // newMath is the math that the user input
                    // nextMath is the next step
                    if (newMath) {
                        transform.transformNodes(newSelections, newMath);
                        history.addStep(nextMath);
                        this.setState({ history, modal: null });
                    } else {
                        this.setState({ modal: null });
                    }
                    completionCallback();
                };

                const modal = <Modal
                    callback={callback}
                />;

                this.setState({ modal });
            } else {
                transform.transformNodes(newSelections);
                history.addStep(nextMath);
                this.setState({ history });
                completionCallback();
            }
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
        const { selections } = renderer.state;

        if (selections.length === 0 && root.type === 'Equation') {
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
        const { selections } = renderer.state;

        const op = opDict[text[0]];

        const expr = this.parser.parse(text.substring(1)).root;
        const math = history.getCurrentStep().clone();

        // TODO: handle -x+x
        if (selections.length === 1 && selections[0].type === "single") {
            const selectedNode = selections[0].first;
            const node = selectedNode ? findNode(math, selectedNode.id) : math.root;

            if (['+', '-'].includes(text[0]) && compare(expr, new Literal(0))) {
                node.parent.replace(node, op(node.clone(), expr));
                history.addStep(math);
                this.setState({history});
            } else if (['*', '/'].includes(text[0]) && compare(expr, new Literal(1))) {
                node.parent.replace(node, op(node.clone(), expr));
                history.addStep(math);
                this.setState({math, history});
            } else if (['*', '/'].includes(text[0]) && node.type === 'Literal' && node.value === 0) {
                node.parent.replace(node, op(node.clone(), expr));
                history.addStep(math);
                this.setState({math, history});
            }
        }

        renderer.setState({menu: null, selections: []});
    }

    showModal(modal) {
        this.setState({ modal });
    }

    render() {
        const { goal, history, modal, view } = this.state;

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

        const goalStyle = {
            position: 'absolute',
            bottom: 250,
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
            {goal &&
                <div style={goalStyle}>
                    <StaticMath
                        width={window.innerWidth}
                        height={200}
                        math={goal}
                    />
                </div>
            }
            <div style={bottomContainer}>
                <span style={{textAlign: 'center', flexGrow:1}} />
                <span>
                    <input type="text" style={{fontSize:20}} ref="performText"/>
                    <button onClick={this.handlePerform} style={buttonStyle}>
                        Perform
                    </button>
                </span>
            </div>
            {modal}
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

const React = require('react');

const { Component } = React;
const History = require('./history.js');
const MathRenderer = require('./math-renderer.js');
const HistoryRenderer = require('./history-renderer.js');
const Parser = require('../parser.js');
const Selection = require('./selection.js');
const Modal = require('./modal.js');
const StaticMath = require('./static-math.js');
const { findNode } = require('../util/node_utils.js');

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

                    const modal = transform.getModal(newSelections, callback);

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

    handleHistory() {
        this.setState({ view: 'history' });
    }

    handleEdit() {
        this.setState({ view: 'edit' });
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

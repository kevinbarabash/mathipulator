const React = require('react');

const { Component } = React;

const { createFlatLayout } = require('./layout.js');

class HistoryRenderer extends Component {
    constructor() {
        super();

        this.state = {
            context: null,
            layoutHistory: [],
        }
    }

    static defaultProps = {
        color: 'black',
        fontSize: 72,
        historyGap: 16,
    };

    componentDidMount() {
        const container = this.refs.container;

        const canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;

        const { history, fontSize } = this.props;

        let layoutHistory = [...this.state.layoutHistory];

        if (history.length > layoutHistory.length) {
            for (let i = layoutHistory.length; i < history.length; i++) {
                layoutHistory.push(createFlatLayout(
                    history.getStep(i), fontSize, window.innerWidth, window.innerHeight));
            }
        } else {
            layoutHistory = [];
            for (let i = 0; i < history.length; i++) {
                layoutHistory.push(createFlatLayout(
                    history.getStep(i), fontSize, window.innerWidth, window.innerHeight));
            }
        }

        const context = canvas.getContext('2d');

        const { historyGap } = this.props;
        const currentLayout = layoutHistory[history.current];
        this.drawLayouts(context, history, currentLayout, layoutHistory, historyGap, 1.0);

        container.appendChild(canvas);

        this.setState({ context, layoutHistory });
    }

    componentWillReceiveProps(nextProps) {
        const { fontSize, history } = nextProps;

        let layoutHistory = [...this.state.layoutHistory];

        if (history.length > layoutHistory.length) {
            for (let i = layoutHistory.length; i < history.length; i++) {
                layoutHistory.push(createFlatLayout(
                    history.getStep(i), fontSize, window.innerWidth, window.innerHeight));
            }
        } else {
            layoutHistory = [];
            for (let i = 0; i < history.length; i++) {
                layoutHistory.push(createFlatLayout(
                    history.getStep(i), fontSize, window.innerWidth, window.innerHeight));
            }
        }

        this.setState({ layoutHistory });
    }

    componentWillUpdate(nextProps, nextState) {
        const { context } = this.state;
        const { historyGap, history } = nextProps;

        if (context) {
            const canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const layout = nextState.layoutHistory[nextProps.history.current];
            const layoutHistory = nextState.layoutHistory;

            context.fillStyle = nextProps.color;

            this.drawLayouts(context, history, layout, layoutHistory, historyGap, 1.0);
        }
    }

    drawLayouts(context, history, currentLayout, layoutHistory, historyGap) {
        let k = 192;
        const showHistory = true;

        // draw previous steps
        if (showHistory) {
            context.save();
            for (let i = history.current - 1; i > -1; i--) {
                const bounds = layoutHistory[i].getBounds();

                const nextBounds = layoutHistory[i+1].getBounds();
                const height = bounds.bottom - nextBounds.top + historyGap;
                context.translate(0,-height);

                context.fillStyle = `rgb(${k}, ${k}, ${k})`;
                layoutHistory[i].render(context);
            }
            context.restore();
        }

        // draw current step
        context.fillStyle = 'rgb(0, 0, 0)';
        currentLayout.render(context);

        // draw next steps
        if (showHistory) {
            context.save();
            for (let i = history.current + 1; i < history.length; i++) {
                const bounds = layoutHistory[i].getBounds();

                const prevBounds = layoutHistory[i - 1].getBounds();
                const height = prevBounds.bottom - bounds.top + historyGap;
                context.translate(0, +height);

                context.fillStyle = `rgb(${k}, ${k}, ${k})`;
                layoutHistory[i].render(context);
            }
            context.restore();
        }
    }

    render() {
        return <div
            ref="container"
            style={styles.container}
            onClick={this.handleClick}
            onMouseDown={this.handleMouseDown}
        ></div>;
    }
}

const styles = {
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
    }
};

module.exports = HistoryRenderer;

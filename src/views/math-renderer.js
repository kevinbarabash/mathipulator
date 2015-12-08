const React = require('react');

const { Component } = React;

const Menu = require('./menu.js');
const { createFlatLayout, unionBounds } = require('./layout.js');
const transforms = require('../transforms.js');
const { findNode, traverseNode } = require('../util/node_utils.js');
const { AnimatedLayout } = require('./animation.js');
const { roundRect, fillCircle } = require('./canvas-util.js');

class MathRenderer extends Component {
    constructor() {
        super();

        this.state = {
            context: null,
            menu: null,
            selectedNode: null,
            layout: null,
            layoutHistory: [],
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    static defaultProps = {
        color: 'black',
        fontSize: 72,
        historyGap: 8,
    };

    componentDidMount() {
        const container = this.refs.container;

        console.log("creating canvas");
        const canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;

        const { math, fontSize } = this.props;
        const layout = createFlatLayout(
            math, fontSize, window.innerWidth, window.innerHeight);

        const context = canvas.getContext('2d');
        layout.render(context);

        container.appendChild(canvas);

        this.setState({ context, layout });
    }

    componentWillReceiveProps(nextProps) {
        const { math, fontSize, history } = nextProps;

        let layoutHistory = [...this.state.layoutHistory];

        if (history.length > layoutHistory.length) {
            for (let i = layoutHistory.length; i < history.length; i++) {
                layoutHistory.push(createFlatLayout(
                    history[i], fontSize, window.innerWidth, window.innerHeight));
            }
        }
        if (history.length === 0) {
            layoutHistory = [];
        }

        const layout = createFlatLayout(math, fontSize, window.innerWidth, window.innerHeight);
        this.setState({ layout, layoutHistory });
    }

    componentWillUpdate(nextProps, nextState) {
        const { context } = this.state;
        const { historyGap } = nextProps;

        if (context) {
            const canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const { selectedNode } = nextState;

            if (selectedNode) {
                this.drawSelection(selectedNode, nextState.layout);
            }

            context.fillStyle = nextProps.color;

            if (this.state.layout !== nextState.layout) {
                const animatedLayout = new AnimatedLayout(this.state.layout, nextState.layout);
                const layoutHistory = nextState.layoutHistory;

                let t = 0;
                animatedLayout.callback = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    this.drawLayouts(animatedLayout, layoutHistory, historyGap, t);
                    t += 0.035;
                };

                animatedLayout.start();
            } else {
                const { layout } = nextState;
                const layoutHistory = this.state.layoutHistory;

                this.drawLayouts(layout, layoutHistory, historyGap, 1.0);
            }
        }
    }

    getSelectedLayouts(layout, selectedNode) {
        const layoutDict = {};

        // layout node ids start with the math node's id but may contain additional
        // strings separate by ':' to disambiguate different parts of a layout
        // that belong to the same math node.
        layout.children.forEach(child => {
            const id = child.id.split(':')[0];
            if (!layoutDict.hasOwnProperty(id)) {
                layoutDict[id] = [];
            }
            layoutDict[id].push(child);
        });

        const selectedLayouts = [];
        traverseNode(selectedNode, (node) => {
            if (layoutDict.hasOwnProperty(node.id)) {
                selectedLayouts.push(...layoutDict[node.id]);
            }
        });

        return selectedLayouts;
    }

    drawLayouts(layout, layoutHistory, historyGap, t) {
        const { context } = this.state;

        let k = 192;
        context.save();
        for (let i = layoutHistory.length - 1; i > -1; i--) {
            const bounds = layoutHistory[i].getBounds();
            const height = bounds.bottom - bounds.top + historyGap;
            if (i === layoutHistory.length - 1) {
                context.translate(0,-height * Math.min(t, 1.0));
            } else {
                context.translate(0,-height);
            }
            context.fillStyle = `rgb(${k}, ${k}, ${k})`;
            layoutHistory[i].render(context);
        }
        context.restore();

        context.fillStyle = 'rgb(0, 0, 0)';
        layout.render(context);
    }

    drawSelection(selectedNode, layout) {
        const { context } = this.state;

        const selectedLayouts = this.getSelectedLayouts(layout, selectedNode);

        const bounds = unionBounds(selectedLayouts);
        const circle = selectedLayouts.length ? !!selectedLayouts[0].circle : false;

        const padding = 8;

        context.fillStyle = 'rgba(255,255,0,0.5)';

        if (circle) {
            const x = (bounds.left + bounds.right) / 2;
            const y = (bounds.top + bounds.bottom) / 2;
            const radius = (bounds.right - bounds.left) / 2 + padding;
            fillCircle(context, x, y, radius);
        } else {
            const radius = padding;
            const x = bounds.left - radius;
            const y = bounds.top - radius;
            const width = bounds.right - bounds.left + 2 * radius;
            const height = bounds.bottom - bounds.top + 2 * radius;
            roundRect(context, x, y, width, height, radius);
        }
    }

    handleClick(e) {
        const { math } = this.props;
        const { layout, selectedNode } = this.state;
        const hitNode = layout.hitTest(e.pageX, e.pageY);

        if (hitNode && hitNode.selectable) {
            let mathNode = findNode(math, hitNode.id);
            if (selectedNode && findNode(selectedNode, hitNode.id)) {
                mathNode = selectedNode.parent;
            }

            if (!mathNode) {
                this.setState({ menu: null, selectedNode: null });
                return;
            }

            const selectedLayouts = this.getSelectedLayouts(layout, mathNode);

            const bounds = unionBounds(selectedLayouts);
            const x = (bounds.left + bounds.right) / 2;
            const y = bounds.top - 10;

            let menu = null;

            if (mathNode) {
                const items = Object.values(transforms)
                    .filter(transform => transform.canTransform(mathNode))
                    .map(transform => {
                        return {
                            label: transform.label,
                            action: () => {
                                this.props.onClick(mathNode.id, transform);
                                this.setState({ menu: null, selectedNode: null });
                            }
                        }
                    });

                if (items.length > 0) {
                    menu = <Menu position={{x, y}} items={items}/>;
                }
            }

            this.setState({ menu, selectedNode: mathNode });
        } else {
            this.setState({ menu: null, selectedNode: null });
        }
    }

    handleMouseDown(e) {
        e.preventDefault();
    }

    render() {
        const { menu } = this.state;

        return <div>
            <div
                ref="container"
                style={styles.container}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
            ></div>
            {menu}
        </div>;
    }
}

const styles = {
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
    }
};

module.exports = MathRenderer;

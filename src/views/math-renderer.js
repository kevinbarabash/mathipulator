const React = require('react');

const { Component } = React;

const Menu = require('./menu.js');
const { createFlatLayout } = require('./layout.js');
const transforms = require('../transforms.js');
const { findNode } = require('../util/node_utils.js');
const { AnimatedLayout } = require('./animation.js');

class MathRenderer extends Component {
    constructor() {
        super();

        this.state = {
            context: null,
            menu: null,
            selectedNode: null
        };

        this.handleClick = this.handleClick.bind(this);
    }

    static defaultProps = {
        color: 'black',
        fontSize: 72
    };

    componentDidMount() {
        const container = this.refs.container;

        console.log("creating canvas");
        const canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;

        const { math, color, fontSize } = this.props;
        const layout = createFlatLayout(
            math, fontSize, window.innerWidth, window.innerHeight);

        const context = canvas.getContext('2d');
        context.fillStyle = color;
        layout.render(context);

        container.appendChild(canvas);

        this.setState({context, layout});
    }

    componentWillReceiveProps(nextProps) {
        const { math, fontSize } = nextProps;
        const layout = createFlatLayout(math, fontSize, window.innerWidth, window.innerHeight);
        this.setState({layout});
    }

    componentWillUpdate(nextProps, nextState) {
        const {context} = this.state;

        if (context) {
            const canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const {selectedNode} = nextState;

            if (selectedNode) {
                const bounds = selectedNode.getBounds();

                context.fillStyle = 'rgba(255,255,0,0.5)';
                context.fillRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
            }

            context.fillStyle = nextProps.color;

            if (this.state.layout !== nextState.layout) {
                const layout = new AnimatedLayout(this.state.layout, nextState.layout);

                layout.callback = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    layout.render(context);
                };

                layout.start();
            } else {
                nextState.layout.render(context);
            }
        }
    }

    handleClick(e) {
        const { math } = this.props;
        const { layout } = this.state;
        const layoutNode = layout.hitTest(e.pageX, e.pageY);

        if (layoutNode) {
            const bounds = layoutNode.getBounds();

            const x = (bounds.left + bounds.right) / 2;
            const y = bounds.top - 10;

            const mathNode = findNode(math, layoutNode.id);

            const items = Object.values(transforms)
                .filter(transform => transform.canTransform(mathNode))
                .map(transform => {
                    return {
                        label: transform.label,
                        action: () => {
                            this.props.onClick(layoutNode.id, transform);
                            this.setState({menu: null, selectedNode: null});
                        }
                    }
                });

            const menu = items.length > 0 ?
                <Menu position={{x, y}} items={items}/> : null;

            this.setState({menu, selectedNode: layoutNode});
        } else {
            this.setState({menu: null, selectedNode: null});
        }
    }

    render() {
        const {menu} = this.state;

        return <div>
            <div
                ref="container"
                style={styles.container}
                onClick={this.handleClick}
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

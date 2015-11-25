const React = require('react');

const { Component } = React;

const { createFlatLayout } = require('../layout.js');
const Menu = require('./menu.js');

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

        const {expression, color, fontSize} = this.props;
        const layout = createFlatLayout(
            expression, fontSize, window.innerWidth, window.innerHeight);

        const context = canvas.getContext('2d');
        context.fillStyle = color;
        layout.render(context);

        container.appendChild(canvas);

        this.setState({context, layout});
    }

    componentWillReceiveProps(nextProps) {
        const {expression, fontSize} = nextProps;
        const layout = createFlatLayout(expression, fontSize, window.innerWidth, window.innerHeight);
        this.setState({layout});
    }

    componentWillUpdate(nextProps, nextState) {
        const {context} = this.state;

        if (context) {
            const canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const {selectedNode, layout} = nextState;

            if (selectedNode) {
                const bounds = selectedNode.bounds;

                context.fillStyle = 'rgba(255,255,0,0.5)';
                context.fillRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
            }

            context.fillStyle = nextProps.color;
            layout.render(context);
        }
    }

    handleClick(e) {
        const { pageX:x, pageY:y } = e;
        const { layout } = this.state;

        const layoutNode = layout.hitTest(x, y);

        if (layoutNode) {
            const bounds = layoutNode.bounds;

            const x = (bounds.left + bounds.right) / 2;
            const y = bounds.top - 10;

            const items = [{
                label: 'commute',
                action: () => {
                    console.log('commute');
                    this.setState({menu: null, selectedNode: null});
                }
            }, {
                label: 'eval',
                action: () => {
                    console.log('eval');
                    this.setState({menu: null, selectedNode: null});
                }
            }];
            const menu = <Menu position={{x, y}} items={items}/>;
            this.setState({menu, selectedNode: layoutNode});
        } else {
            this.setState({menu: null, selectedNode: null});
        }
    };

    render() {
        const {menu} = this.state;

        return <div>
            <div
                style={styles.container}
                onClick={this.handleClick}
                ref="container"
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

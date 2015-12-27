const React = require('react');

const { Component } = React;

const Menu = require('./menu.js');
const { createFlatLayout, unionBounds } = require('./layout.js');
const transforms = require('../transforms.js');
const { findNode, traverseNode } = require('../util/node_utils.js');
const { AnimatedLayout } = require('./animation.js');
const { roundRect, fillCircle } = require('./canvas-util.js');
const Selection = require('./selection.js');

class MathRenderer extends Component {
    constructor() {
        super();

        this.state = {
            context: null,
            menu: null,
            selectedNodes: [],
            layout: null,
            start: null,
            multiselect: false,
            timeout: null,
        };

        this.handleClick = this.handleClick.bind(this);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    static defaultProps = {
        color: 'black',
        fontSize: 72,
    };

    componentDidMount() {
        const container = this.refs.container;

        const canvas = document.createElement('canvas');
        canvas.width = this.props.width;
        canvas.height = this.props.height;

        const { fontSize, math } = this.props;

        let layout = createFlatLayout(
            math, fontSize, window.innerWidth, window.innerHeight);

        const context = canvas.getContext('2d');

        this.drawLayout(context, layout);

        container.appendChild(canvas);

        this.setState({ context, layout });
    }

    componentWillReceiveProps(nextProps) {
        const { fontSize, math } = nextProps;

        let layout = createFlatLayout(
            math, fontSize, window.innerWidth, window.innerHeight);

        this.setState({ layout });
    }

    componentWillUpdate(nextProps, nextState) {
        const { context } = this.state;

        if (context) {
            const canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const currentLayout = this.state.layout;
            const nextLayout = nextState.layout;

            const { selectedNodes, hitNode } = nextState;

            if (selectedNodes.length > 0) {
                this.drawSelection(selectedNodes, hitNode, nextLayout, nextState);
            }

            context.fillStyle = nextProps.color;

            if (currentLayout !== nextLayout) {
                const animatedLayout = new AnimatedLayout(currentLayout, nextLayout);

                let t = 0;
                animatedLayout.callback = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    this.drawLayout(context, animatedLayout);
                    t += 0.035;
                };

                animatedLayout.start();
            } else {
                this.drawLayout(context, currentLayout);
            }
        }
    }

    getSelectionHighlights(layout, selections, hitNode) {
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

        const highlights = [];

        selections.forEach(selection => {
            const layouts = [];

            for (const node of selection) {
                if (node.type === 'Equation' && hitNode.text === "=") {
                    layouts.push(hitNode);
                } else {
                    traverseNode(node, (node) => {
                        if (layoutDict.hasOwnProperty(node.id)) {
                            layouts.push(...layoutDict[node.id]);
                        }
                    });
                }
            }

            highlights.push({
                shape: layouts.length === 1 && layouts[0].circle ? 'circle' : 'rect',
                bounds: unionBounds(layouts),
            });
        });

        return highlights;
    }

    drawLayout(context, currentLayout) {
        context.fillStyle = 'rgb(0, 0, 0)';
        currentLayout.render(context);

    }

    drawSelection(selectedNodes, hitNode, layout, nextState) {
        const { context } = this.state;

        const highlights = this.getSelectionHighlights(layout, selectedNodes, hitNode);
        const padding = 8;

        if (nextState.multiselect) {
            context.fillStyle = 'rgba(0,128,0,0.5)';
        } else {
            context.fillStyle = 'rgba(255,255,0,0.5)';
        }

        for (const {shape, bounds} of highlights) {
            if (shape === 'circle') {
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
    }

    performTransform(selectedNodes, transform) {
        this.props.onClick(selectedNodes, transform);
        this.setState({
            menu: null,
            selectedNodes: [],
            multiselect: false
        });
    }

    handleClick(e) {

    }

    handleMouseDown(e) {
        e.preventDefault();

        const { math } = this.props;
        const { layout, selectedNodes, multiselect } = this.state;
        const hitNode = layout.hitTest(e.pageX, e.pageY);

        if (hitNode && hitNode.selectable) {
            const id = hitNode.id.split(":")[0];
            let mathNode = findNode(math, id);

            // TODO: handle enlarging the selection by dragging
            // TODO: tap a selection again to toggle it
            // tap in whitepsace to drop all selections
            // if you've already created a selection as part of multiselect and
            // then you grow a new selection... the new selection will actively
            // reject growing to including any of the existing selections

            //if (selectedNode && findNode(selectedNode, id)) {
            //    mathNode = selectedNode.parent;
            //}

            if (!mathNode) {
                this.setState({ menu: null, selectedNodes: [] });
                return;
            }

            let newSelectedNodes = [];

            if (multiselect) {
                if (selectedNodes.every(selection => !selection.includes(mathNode))) {
                    newSelectedNodes = [...selectedNodes, new Selection(mathNode)];
                } else {
                    const index = selectedNodes.findIndex(selection => selection.includes(mathNode));

                    if (index != undefined) {
                        newSelectedNodes = [...selectedNodes.slice(0, index), ...selectedNodes.slice(index + 1)];
                    }
                }
            } else {
                if (selectedNodes.includes(mathNode)) {
                    newSelectedNodes = [];
                } else {
                    newSelectedNodes = [new Selection(mathNode)];
                }
            }

            const items = Object.values(transforms)
                .filter(transform => {
                    if (newSelectedNodes.length === 1) {
                        if (newSelectedNodes[0].type === "single") {
                            return transform.canTransform(newSelectedNodes[0].first);
                        } else {
                            return false;
                        }
                    } else if (transform.hasOwnProperty('canTransformNodes')) {
                        return transform.canTransformNodes(newSelectedNodes);
                    }
                })
                .map(transform => {
                    return {
                        label: transform.label,
                        action: () => this.performTransform(newSelectedNodes, transform)
                    }
                });

            const highlights = this.getSelectionHighlights(layout, newSelectedNodes, hitNode);

            const pos = { x:Infinity, y:Infinity };
            for (const {bounds} of highlights) {
                const x = (bounds.left + bounds.right) / 2;
                const y = bounds.top - 10;
                if (y < pos.y) {
                    pos.x = x;
                    pos.y = y;
                }
            }

            if (this.state.timeout) {
                clearTimeout(this.state.timeout);
            }

            const timeout = setTimeout(() => {
                const {start, current, mouse} = this.state;

                const dx = current.x - start.x;
                const dy = current.y - start.y;

                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 25 && mouse === 'down') {
                    this.setState({
                        multiselect: true
                    });
                }
            }, 500);

            const menu = items.length > 0 ? <Menu position={pos} items={items}/> : null;

            this.setState({
                menu,
                selectedNodes: newSelectedNodes,
                hitNode,
                start: {
                    x: e.pageX,
                    y: e.pageY,
                    timestamp: Date.now(),
                },
                current: {
                    x: e.pageX,
                    y: e.pageY,
                    timestamp: Date.now(),
                },
                mouse: 'down',
                timeout,
            });
        } else {
            this.setState({
                menu: null,
                selectedNodes: [],
                hitNode: null,
                multiselect: false,
                timeout: null
            });
        }
    }

    handleMouseMove(e) {
        this.setState({
            current: {
                x: e.pageX,
                y: e.pageY,
                timestamp: Date.now(),
            },
        });

        e.preventDefault();

        const { math } = this.props;
        const { layout, selectedNodes, mouse } = this.state;

        if (mouse === 'down') {
            const hitNode = layout.hitTest(e.pageX, e.pageY);

            if (hitNode && hitNode.selectable) {
                const id = hitNode.id.split(":")[0];
                let mathNode = findNode(math, id);

                if (selectedNodes.length > 0) {
                    const selection = selectedNodes[selectedNodes.length - 1].clone();
                    const parent = selection.first.parent;

                    const previousSelections = selectedNodes.slice(0, selectedNodes.length - 1);

                    if (previousSelections.some(previousSelection => previousSelection.includes(mathNode))) {
                        return;
                    }

                    if (mathNode.parent === parent && ['Expression', 'Product'].includes(parent.type)) {
                        if (parent.indexOf(mathNode) < parent.indexOf(selection.first)) {
                            selection.first = mathNode;
                        }

                        if (parent.indexOf(mathNode) > parent.indexOf(selection.last)) {
                            selection.last = mathNode;
                        }

                        // expand selection to include operands if necessary
                        if (selection.first.type === 'Operator') {
                            selection.first = selection.first.prev;
                        }

                        if (selection.last.type === 'Operator') {
                            selection.last = selection.last.next;
                        }

                        // if we've selected all terms in the expression or all
                        // factors in the product, select the parent instead
                        if (selection.first === parent.first && selection.last === parent.last) {
                            selection.first = parent;
                            selection.last = parent;
                        }

                        // abort if the new selection in intersecting previous selections
                        if (previousSelections.some(previous => previous.intersects(selection))) {
                            return;
                        }

                        this.setState({
                            selectedNodes: [...previousSelections, selection]
                        });
                    } else if (selection.first.parent.type === 'Fraction') {
                        if (!findNode(selection.first, mathNode.id)) {
                            if (findNode(parent, mathNode.id)) {
                                selection.first = parent;
                                selection.last = parent;

                                // abort if the new selection in intersecting previous selections
                                if (previousSelections.some(previous => previous.intersects(selection))) {
                                    return;
                                }

                                this.setState({
                                    selectedNodes: [...previousSelections, selection]
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    handleMouseUp(e) {
        this.setState({
            mouse: 'up'
        });
    }

    render() {
        const { menu } = this.state;

        return <div>
            <div
                ref="container"
                style={styles.container}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
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

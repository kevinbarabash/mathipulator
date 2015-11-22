const React = require('react');
const ReactDOM = require('react-dom');

const { Component } = React;

const Menu = require('./menu.js');

class TestApp extends Component {
    state = {
        menu: null
    };

    handleClick = (e) => {
        if (this.state.menu) {
            this.setState({menu: null});
        } else {
            const position = {
                x: e.pageX,
                y: e.pageY
            };
            const items = [{
                label: 'commute',
                action: () => {
                    console.log('commute');
                }
            }, {
                label: 'eval',
                action: () => {
                    console.log('eval');
                }
            }];
            const menu = <Menu position={position} items={items}/>;
            this.setState({menu});
        }
    };

    render() {
        const {menu} = this.state;

        return <div style={styles.app} onClick={this.handleClick}>
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

const container = document.getElementById('app-container');
ReactDOM.render(<TestApp/>, container);

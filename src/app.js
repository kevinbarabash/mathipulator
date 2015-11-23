const React = require('react');

const { Component } = React;

const Menu = require('./menu.js');

class App extends Component {
    constructor() {
        super();

        this.state = {
            menu: null
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
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
    }

    render() {
        const {menu} = this.state;

        return <div style={styles.app} onClick={this.handleClick}>
            <h1>Hello,world!</h1>
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

module.exports = App;

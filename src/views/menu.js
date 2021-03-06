const React = require('react');

const { Component } = React;

class MenuItem extends Component {
    static propTypes = {
        label: React.PropTypes.string,
        action: React.PropTypes.func
    };

    state = {
        hover: false
    };

    handleClick = () => {
        this.props.action && this.props.action();
    };

    handleMouseOver = () => {
        this.setState({hover:true});
    };

    handleMouseOut = () => {
        this.setState({hover:false});
    };

    render () {
        const style = {
            cursor: 'pointer'
        };

        if (this.state.hover) {
            style.color = 'yellow';
        }

        return <li
            style={style}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleClick}
        >
            {this.props.label}
        </li>;
    }
}

class Menu extends Component {
    static propTypes = {
        position: React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number
        }),
        items: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                action: React.PropTypes.function
            })
        )
    };

    render() {
        const { position } = this.props;

        const menuStyle = {
            ...styles.menu,
            left: position.x,
            top: position.y
        };

        return <div style={menuStyle}>
            <ul style={styles.ul}>
                {this.props.items.map(item => <MenuItem key={item.label} label={item.label} action={item.action} />)}
            </ul>
            <div style={styles.triangle}></div>
        </div>;
    }
}


const styles = {
    menu: {
        display: 'inline-block',
        fontFamily: 'helvetica',
        fontSize: 22,
        fontWeight: 100,
        color: 'white',
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        left: 0,
        top: 0
    },
    ul: {
        display: 'inline-block',
        listStyleType: 'none',
        backgroundColor: '#999',
        margin: 0,
        padding: 10,
        borderRadius: 10
    },
    triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '10px 10px 0 10px',
        borderColor: `#999 transparent transparent transparent`,
        margin: 'auto'
    }
};

module.exports = Menu;

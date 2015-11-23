const React = require('react');

const { Component } = React;

class Menu extends Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string
        })),
        position: React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number
        })
    };

    static defaultProps = {
        items: [
            {
                label: 'item 1'
            },
            {
                label: 'item 2'
            },
            {
                label: 'item 3'
            }
        ]
    };

    render() {
        const { position } = this.props;

        const menuStyle = {
            ...styles.menu,
            left: position.x,
            top: position.y,
        };

        return <div style={menuStyle}>
            <ul style={styles.ul}>
                {this.props.items.map(item => {
                    return <li
                        style={styles.li}
                        key={item.label}
                        onClick={item.action}
                    >
                        {item.label}
                    </li>;
                })}
            </ul>
            <div style={styles.triangle}></div>
        </div>;
    }
}


const styles = {
    menu: {
        display: 'inline-block',
        fontFamily: 'helvetica',
        fontSize: 20,
        color: 'yellow',
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        left: 0,
        top: 0
    },
    ul: {
        display: 'inline-block',
        listStyleType: 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        margin: 0,
        padding: 10,
        borderRadius: 10
    },
    li: {
        cursor: 'pointer',
    },
    triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '10px 10px 0 10px',
        borderColor: `rgba(0,0,0,0.5) transparent transparent transparent`,
        margin: 'auto'
    }
};

module.exports = Menu;

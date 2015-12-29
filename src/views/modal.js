const React = require('react');

const { Component } = React;

const { compare } = require('../util/node_utils.js');
const Parser = require('../parser.js');
const StaticMath = require('./static-math.js');

const parser = new Parser();

class Modal extends Component {
    constructor() {
        super();
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        if (e.keyCode == 13 ) {
            console.log(e.target.value);
            const newMath = parser.parse(e.target.value);
            if (compare(this.props.math, newMath)) {
                console.log('valid replacement');
                this.props.callback(newMath);
            } else {
                console.log('invalid');
            }
        }
    }

    render() {
        return <div style={backgroundStyle}>
            <div style={modalStyle}>
                <StaticMath math={this.props.math} width={200} height={200} />
                <div style={inputContainer}>
                    = &nbsp;
                    <input
                        type="text"
                        style={{fontSize: 60, fontFamily: "Helvetica-Light"}}
                        size={6}
                        onKeyDown={this.handleKeyDown}
                    />
                </div>
            </div>
        </div>;
    }
}

const backgroundStyle = {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.25)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalStyle = {
    width: 500,
    height: 200,
    backgroundColor: 'white',
    position: 'relative',
};

const inputContainer = {
    position: 'absolute',
    width: 300,
    height: 200,
    left: 200,
    top: 0,
    fontSize: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

module.exports = Modal;

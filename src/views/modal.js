const React = require('react');

const { Component } = React;

const Parser = require('../parser.js');
const StaticMath = require('./static-math.js');

const parser = new Parser();

class Modal extends Component {
    handleAccept() {
        const input = parser.parse(this.refs.input.value);
        if (this.props.math) {
            if (this.props.validateInput(this.props.math, input)) {
                this.props.callback(input.root);
            } else {
                // TODO: provide in modal feedback
                console.log('invalid');
            }
        } else {
            this.props.callback(input.root);
        }
    }

    handleCancel() {
        this.props.callback();
    }

    render() {
        return <div style={backgroundStyle}>
            <div style={modalStyle}>
                {this.props.math &&
                <StaticMath math={this.props.math} width={200} height={200} />}
                <div style={inputContainer}>
                    = &nbsp;
                    <input
                        ref="input"
                        type="text"
                        style={{fontSize: 60, fontFamily: "Helvetica-Light"}}
                        size={6}
                    />
                </div>
                <div style={{position:'absolute', bottom:8, right:8}}>
                    <button
                        onClick={() => this.handleCancel()}
                        style={{marginRight: 8}}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => this.handleAccept()}
                    >
                        Accept
                    </button>
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
    top: -200,
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

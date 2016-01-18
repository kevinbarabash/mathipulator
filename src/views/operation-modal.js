const React = require('react');

const { Component } = React;

const Parser = require('../parser.js');

const parser = new Parser();

class OperationModal extends Component {

    handleAccept() {
        const options = {
            operation: this.refs.operation.value,
            operand: parser.parse(this.refs.input.value).root
        };

        // TODO: validateInput should have success/failure callbacks
        // the failure callback should have a message that we can display
        // or use a promise so that we can use async/await
        if (this.props.validateInput(options)) {
            this.props.callback(options);
        } else {
            // TODO: provide in modal feedback
            console.log('invalid input');
        }
    }

    handleCancel() {
        this.props.callback();
    }

    render() {
        return <div style={backgroundStyle}>
            <div style={modalStyle}>

                <div style={inputContainer}>
                    <select ref='operation'>
                        <option value='add'>+</option>
                        <option value='sub'>{'\u2212'}</option>
                        <option value='mul'>{'\u00D7'}</option>
                        <option value='div'>{'\u00F7'}</option>
                    </select> &nbsp;
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
    width: 500,
    height: 200,
    left: 0,
    top: 0,
    fontSize: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

module.exports = OperationModal;

const Node = require('./node');

class Negation extends Node {
    constructor(value) {
        super();
        Object.assign(this, { type: 'Negation', value });
    }

    // TODO: add clone() method
}

module.exports = Negation;

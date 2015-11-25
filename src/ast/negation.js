const Node = require('./node');

class Negation extends Node {
    constructor(value) {
        super();
        Object.assign(this, { type: 'Negation', value });
    }
}

module.exports = Negation;

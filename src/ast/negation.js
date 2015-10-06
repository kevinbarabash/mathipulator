import Node from './node'

export default class Negation extends Node {
    constructor(value) {
        super();
        Object.assign(this, { type: 'Negation', value });
    }
    
    add(node) {
        
    }
}

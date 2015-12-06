let _id = 1;

class Node {
    constructor() {
        this.id = _id++;
        this.parent = null;
        this.next = null;
        this.prev = null;
    }
}

module.exports = Node;

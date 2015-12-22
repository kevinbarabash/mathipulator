let _id = 1;

class Node {
    constructor() {
        this.id = Node.generateId();
        this.parent = null;
        this.next = null;
        this.prev = null;
    }

    static generateId() {
        return String(_id++);
    }
}

module.exports = Node;

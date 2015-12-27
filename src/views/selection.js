const { findNode } = require('../util/node_utils.js');

class Selection {
    constructor(first, last = first) {
        Object.assign(this, { first, last });
    }

    get type() {
        return this.first === this.last ? 'single' : 'range';
    }

    *[Symbol.iterator]() {
        // TODO: check if they have the same parent
        let node = this.first;
        while (node != this.last) {
            let current = node;
            node = node.next;
            yield current;
        }
        yield this.last;
    }

    includes(node) {
        if (this.type === 'single') {
            return findNode(this.first, node.id);
        } else {
            for (const child of this) {
                if (findNode(child, node.id)) {
                    return true;
                }
            }
        }
        return false;
    }

    intersects(selection) {
        for (const node of this) {
            if (selection.includes(node)) {
                return true;
            }
        }
        for (const node of selection) {
            if (this.includes(node)) {
                return true;
            }
        }
        return false
    }

    clone() {
        return new Selection(this.first, this.last);
    }
}

module.exports = Selection;

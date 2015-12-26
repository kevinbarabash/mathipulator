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
}

module.exports = Selection;

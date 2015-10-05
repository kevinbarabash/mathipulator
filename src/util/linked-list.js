export let _next = Symbol();
export let _prev = Symbol();
export let _parent = Symbol();

export default class LinkedList {
    constructor(...nodes) {
        this.first = null;
        this.last = null;
        this.append(...nodes);
    }

    append(...nodes) {
        for (let node of nodes) {
            node[_next] = null;
            node[_parent] = this;
            if (this.first === null && this.last === null) {
                this.first = node;
                this.last = node;
                node[_prev] = null;
            } else {
                this.last[_next] = node;
                node[_prev] = this.last;
                this.last = node;
            }
        }
    }

    prepend(...nodes) {
        for (let node of nodes) {
            node[_prev] = null;
            node[_parent] = this;
            if (this.first === null && this.last === null) {
                this.first = node;
                this.last = node;
                node[_next] = null;
            } else {
                this.first[_prev] = node;
                node[_next] = this.first;
                this.first = node;
            }
        }
    }

    replace(current, replacement) {
        replacement[_prev] = current[_prev];
        replacement[_next] = current[_next];
        if (current[_prev] !== null) {
            current[_prev][_next] = replacement;
        }
        if (current[_next] !== null) {
            current[_next][_prev] = replacement;
        }
        current[_prev] = null;
        current[_next] = null;
        if (this.first === current) {
            this.first = replacement;
        }
        if (this.last === current) {
            this.last = replacement;
        }
    }

    remove(node) {
        if (this.first === node) {
            this.first = node[_next];
            if (this.first) {
                this.first[_prev] = null;
            }
        } else {
            node[_prev][_next] = node[_next];
        }
        if (this.last === node) {
            this.last = node[_prev];
            if (this.last) {
                this.last[_next] = null;
            }
        } else {
            node[_next][_prev] = node[_prev];
        }
    }

    *[Symbol.iterator]() {
        let node = this.first;
        while (node !== null) {
            // grab the current node so that we can do replacements while
            // iterating
            let current = node;
            node = node[_next];
            yield current;
        }
    }

    get length() {
        let count = 0;
        for (let node of this) {
            count++;
        }
        return count;
    }

    toString() {
        let result = "[";
        let first = true;
        for (let node of this) {
            if (!first) {
                result += ", ";
            } else {
                first = false;
            }
            result += node.toString();
        }
        result += "]";
        return result;
    }
}

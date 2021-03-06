const { Expression, Product } = require('../ast.js');
const { findNode, getPath, findCommonAncestor } = require('../util/node_utils.js');

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

    get length() {
        let count = 0;
        for (let node of this) {
            count++;
        }
        return count;
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

    add(mathNode) {
        let parent = this.first.parent;

        if (parent !== mathNode.parent) {
            const ancestor = findCommonAncestor(parent, mathNode);
            const parentPath = getPath(parent);
            const mathNodePath = getPath(mathNode);

            const aNode = parentPath.find(node => node.parent === ancestor);
            const bNode = mathNodePath.find(node => node.parent === ancestor);

            if (aNode) {
                this.first = aNode;
                this.last = aNode;
            }
        }

        if (['Expression', 'Product'].includes(parent.type) && findNode(parent, mathNode.id)) {
            // handles the case of selection a number times a fraction
            for (const node of parent) {
                if (node !== mathNode && findNode(node, mathNode.id)) {
                    mathNode = node;
                }
            }

            if (parent.indexOf(mathNode) < parent.indexOf(this.first)) {
                this.first = mathNode;
            }

            if (parent.indexOf(mathNode) > parent.indexOf(this.last)) {
                this.last = mathNode;
            }

            // expand selection to include operands if necessary
            if (this.first !== this.last) {
                if (this.first.type === 'Operator') {
                    this.first = this.first.prev;
                }

                if (this.last.type === 'Operator') {
                    this.last = this.last.next;
                }
            }

            // if we've selected all terms in the expression or all
            // factors in the product, select the parent instead
            if (this.first === parent.first && this.last === parent.last) {
                this.first = parent;
                this.last = parent;
            }
        } else if (this.first.parent.type === 'Fraction') {
            if (!findNode(this.first, mathNode.id)) {
                if (findNode(parent, mathNode.id)) {
                    this.first = parent;
                    this.last = parent;
                }
            }
        }
    }

    clone() {
        return new Selection(this.first, this.last);
    }

    toExpression() {
        if (this.type === 'single') {
            return this.first;
        } else {
            if (this.first.parent.type === 'Product' && this.first.parent === this.last.parent) {
                const product = new Product();
                product.first = this.first;
                product.last = this.last;
                product.parent = this.first.parent;
                return product;
            } else if (this.first.parent.type === 'Expression' && this.first.parent === this.last.parent) {
                const expression = new Expression();
                expression.first = this.first;
                expression.last = this.last;
                expression.parent = this.first.parent;
                return expression;
            } else {
                throw new Error('toExpression failed');
            }
        }
    }
}

module.exports = Selection;

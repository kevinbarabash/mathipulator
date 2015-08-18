let LinkedList = require('./linked-list.js');
let { _prev, _next, _parent } = LinkedList;
let { Expression, Product, Fraction, Operator, Identifier, Literal } = require('./expression.js');

let distributeBackwards = function(node) {
    if (node[_prev] && node[_prev].operator === '*') {
        let operator = node[_prev];
        if (operator[_prev] && operator[_prev].type === 'Expression') {
            console.log("can distribute backwards");

            let parent = node[_parent];

            let left = operator[_prev];
            for (let child of left) {
                if (child.type !== 'Operator') {
                    let product = new Product();
                    left.replace(child, product);
                    product.append(child, new Operator('*'), node.clone());
                }
            }

            parent.remove(operator);
            parent.remove(node);

            if (parent.first === parent.last) {
                return parent.first;
            }
        }
    }
};

let distributeForwards = function(node) {
    if (node[_next] && node[_next].operator === '*') {
        let operator = node[_next];
        if (operator[_next] && operator[_next].type === 'Expression') {
            console.log("can distribute forwards");

            let parent = node[_parent];

            let right = operator[_next];
            for (let child of right) {
                if (child.type !== 'Operator') {
                    let product = new Product();
                    right.replace(child, product);
                    product.append(node.clone(), new Operator('*'), child);
                }
            }

            parent.remove(operator);
            parent.remove(node);

            if (parent.first === parent.last) {
                return parent.first;
            }
        }
    }
};

module.exports = {
    distributeBackwards,
    distributeForwards
};

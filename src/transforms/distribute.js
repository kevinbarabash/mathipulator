import LinkedList, { _prev, _next, _parent } from '../util/linked-list'
const { Expression, Product, Fraction, Operator, Identifier, Literal } = require('../ast.js');

let distributeBackwards = function(node) {
    // TODO: check that the parent is a 'Product' node and that the node in question is last
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
    // TODO: check that the parent is a 'Product' node and that the node in question is first
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

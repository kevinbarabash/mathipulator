let index;

let parse = function(math) {
    index = 0;
    
    let left = expression(math);
    try {
        match(math, ['=']);
    } catch (e) {
        return left;   
    }
    let right = expression(math);
    return { type: 'Equation', left, right };
};

let match = function(math, tokens) {
    let token = math[index++];
    if (!tokens.includes(token)) {
        throw `expected one of ${tokens} got a ${token}`;
    }
    return token;
};

let whitespace = function(math) {
    while (math[index] === ' ') {
        index++;
    }
};

let expression = function(math) {
    let left = number(math);
    whitespace(math);
    
    while (index < math.length) {
        try {
            let operator = match(math, ['+', '-']);
            let right = number(math);
            left = {
                type: 'BinaryExpression', left, right, operator
            };
            whitespace(math);
        } catch (e) {
            throw `expected one of ${['+', '-']} got a '${math[index]}'`;
        }
    }
    
    return left;
};

let number = function(math) {
    whitespace(math);
    let naturalRegex = /[1-9]/;
    let wholeRegex = /[0-9]/;
    let decimalRegex = /[0-9\.]/;
    let value;

    if (math[index] === ".") {
        let start = index++;
        while (wholeRegex.test(math[index])) {
            index++;
        }
        value = math.substring(start, index);
    } else if (math[index] === "0") {
        let start = index++;
        match(math, ["."]);
        while (wholeRegex.test(math[index])) {
            index++;
        }
        value = math.substring(start, index);
    } else if (naturalRegex.test(math[index])) {
        let start = index++;
        let regex = decimalRegex;
        while (regex.test(math[index])) {
            if (math[index] === ".") {
                regex = wholeRegex;
            }
            index++;
        }
        value = math.substring(start, index);
    } else {
        throw `expected a number`;
    }
    
    // We store the value as a string so that we can maintain its formatting.
    // Only when we evaluate it do we convert it to a float.
    return { type: 'Number', value };
};



let render = function(node) {
    if (node.type === 'Number') {
        return node.value;
    } else if (node.type === 'BinaryExpression') {
        let left = render(node.left);
        let right = render(node.right);
        return `${left} ${node.operator} ${right}`;
    }
};

let renderHTML = function(node) {
    if (node.type === 'Number') {
        return `<span>${node.value}</span>`;
    } else if (node.type === 'BinaryExpression') {
        let left = renderHTML(node.left);
        let right = renderHTML(node.right);
        return `${left} ${node.operator} ${right}`;
    }
};

let evaluate = function(ast, context) {
    
};

/**
 * Return a new AST where identifiers with keys in context have been replaced
 * with the corresponding value which must be an AST node.
 * @param ast
 * @param context
 */
let substitute = function(ast, context) {
    
};

module.exports = {
    parse: parse,
    render: render,
    renderHTML: renderHTML
};

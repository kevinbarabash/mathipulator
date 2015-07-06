function expr(children) {
    return {
        type: 'Expression',
        children: children
    };
}

function ident(name, subscript, accent) {
    return {
        type: 'Identifier',
        name: name,
        subscript: subscript,
        accent: accent
    };
}

function num(number) {
    return {
        type: 'Number',
        number: number
    };
}

function prod(...factors) {
    return {
        type: 'Product',
        factors: factors
    };
}


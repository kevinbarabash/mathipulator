const {
    Equation,
    Expression,
    Product,
    Operator,
    Identifier,
    Literal,
    Power
} = require('./ast.js');

function isAlpha(token) {
    return (token >= 'a' && token <= 'z');
}

function isNumber(token) {
    return /\d*\.\d+|\d+\.\d*|\d+/.test(token);
}

var tokenRegex = /([a-z])|([\(\)\+\-\/\*\^\=])|(\d*\.\d+|\d+\.\d*|\d+)/g;

class Parser {

    // TODO: switch from 'match' to 'exec' so that an invalid input raises an error
    parse(input) {
        this.i = 0;
        this.tokens = input.match(tokenRegex);

        return this.equation();
    }

    equation() {
        var lhs = this.expression();
        var token = this.tokens[this.i++];
        if (token === '=') {
            var rhs = this.expression();

            return new Equation(lhs, rhs);
        }
        return lhs;
    };

    expression() {
        var tokens = this.tokens;
        var children = [];

        children.push(this.term(tokens));

        var token = tokens[this.i++];
        while (token === '+' || token === '-') {
            children.push(new Operator(token));
            children.push(this.term());
            token = tokens[this.i++];
        }
        this.i--;

        if (children.length === 1) {
            return children[0];
        }

        return new Expression(...children);
    }

    term() {
        var tokens = this.tokens;
        var children = [];

        children.push(this.factor(tokens));

        var token = tokens[this.i++];

        // TODO: handle division separately
        while (token === '*' || token === '(' || isAlpha(token)) {
            if (token === '(') {

                children.push(new Operator('*'));

                var expr = this.expression();
                token = tokens[this.i++];
                if (token !== ')') {
                    throw 'expected )';
                }
                children.push(expr);

            } else if (isAlpha(token)) {  // TODO: figure out why we can't let factor() handle this
                children.push(new Operator('*'));
                this.i--; // put the alpha back on so factor() can deal with it
                // TODO: create a peek function to handle this more elegantly
                children.push(this.factor());
                token = tokens[this.i++];
            } else {
                children.push(new Operator('*'));
                children.push(this.factor());
                token = tokens[this.i++];
            }

            if (this.i > tokens.length) {
                break;
            }
        }
        this.i--;

        if (children.length === 1) {
            return children[0];
        }

        return new Product(...children);
    };

    factor() {
        var tokens = this.tokens;
        var token = tokens[this.i++];
        var sign = '';

        // TODO: think about multiple unary minuses
        if (token === '+' || token === '-') {
            sign = token;
            token = tokens[this.i++];
        }


        var base, exp;

        if (isAlpha(token)) {
            base = new Identifier(token);
        } else if (isNumber(token)) {
            base = new Literal(parseFloat(token));
        } else if (token === '(') {
            base = this.expression();
            token = tokens[this.i++];
            if (token !== ')') {
                throw 'expected )';
            }
        }

        if (tokens[this.i++] === '^') {
            exp = this.factor();
            return new Power(base, exp);
        } else {
            this.i--;

            var factor = base;

            // TODO: handle unary minus
            //if ($(factor).is('mrow')) {
            //    if (sign !== '') {
            //        $(factor).attr('unary', 'minus'); // TODO: need to update evaluate.js to understand this
            //    }
            //} else {
            //    var text = $(factor).text();
            //    $(factor).text(sign + text);
            //}

            return factor;
        }
    }

}

module.exports = Parser;


const metrics = require("../data/metrics.json");

function formatText(text) {
    if (parseFloat(text) < 0) {
        text = `(${text})`;
    }
    return String(text).replace(/\-/g, "\u2212");
}

function getMetrics(c, fontSize) {
    const result = {};
    for (const [k, v] of Object.entries(metrics[c.charCodeAt(0)])) {
        result[k] = fontSize * v / 1000;
    }
    return result;
}

class Glyph {
    constructor(c, fontSize) {
        this.x = 0;
        this.y = 0;
        this.text = formatText(c);
        this.fontSize = fontSize;

        const metrics = getMetrics(this.text, fontSize);
        this.advance = metrics.advance;
    }

    render(ctx) {
        // TODO when we flatten group all of the items with the same fontSize
        ctx.font = `${this.fontSize}px 100 Helvetica`;
        ctx.fillText(this.text, this.x, this.y);
    }

    clone() {
        const result = new Glyph(this.text, this.fontSize);
        Object.assign(result, this);
        return result;
    }
}

class Box {
    constructor(x, y, width, height) {
        Object.assign(this, {x, y, width, height});
    }

    render(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    clone() {
        return new Box(this.x, this.y, this.width, this.height);
    }
}

class Layout {
    constructor(children) {
        this.x = 0;
        this.y = 0;
        this.children = children;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        for (const layout of this.children) {
            layout.render(ctx);
        }
        ctx.restore();
    }
}


function createLayout(node, fontSize) {
    const spaceMetrics = getMetrics(" ", fontSize);
    const dashMetrics = getMetrics("-", fontSize);

    if (node.type === "Literal") {
        const text = String(node.value);

        let penX = 0;
        const layouts = [];

        for (const c of text) {
            const glyph = new Glyph(c, fontSize);

            glyph.x = penX;
            penX += glyph.advance;

            layouts.push(glyph);
        }

        const layout = new Layout(layouts);
        layout.advance = penX;
        return layout;
    } else if (node.type === "Operator") {
        return new Glyph(node.operator, fontSize);
    } else if (node.type === "Expression") {
        let penX = 0;
        const layouts = [];
        for (let child of node) {
            const childLayout = createLayout(child, fontSize);

            if (child.type === "Operator") {
                penX += spaceMetrics.advance;
            }

            childLayout.x = penX;
            penX += childLayout.advance;

            if (child.type === "Operator") {
                penX += spaceMetrics.advance;
            }
            layouts.push(childLayout);
        }
        const layout = new Layout(layouts);
        layout.advance = penX;
        return layout;
    } else if (node.type === "Equation") {
        let penX = 0;

        const lhs = createLayout(node.left, fontSize);
        lhs.x = penX;
        penX += lhs.advance;

        // TODO: update Equation to handle inequalities
        const equal = new Glyph("=", fontSize);
        penX += spaceMetrics.advance;
        equal.x = penX;
        penX += equal.advance + spaceMetrics.advance;

        const rhs = createLayout(node.right, fontSize);
        rhs.x = penX;
        penX += rhs.advance;

        const layout = new Layout([lhs, equal, rhs]);
        layout.advance = penX;
        return layout;
    } else if (node.type === "Fraction") {
        const num = createLayout(node.numerator, fontSize);
        const den = createLayout(node.denominator, fontSize);

        // TODO: add Box class to actual render divisior bar
        // TODO: use x-height / 2 to determine divisor bar position
        // TODO: use ascender/descender + gap to determine y-shift
        num.y -= fontSize / 2;
        den.y += fontSize / 2 + 0.15 * fontSize;

        // TODO: calc width so that we can use width where it makes sense
        if (den.advance > num.advance) {
            num.x += (den.advance - num.advance) / 2;
        } else {
            den.x += (num.advance - den.advance) / 2;
        }

        const width = Math.max(num.advance, den.advance);
        const thickness = dashMetrics.height;
        const y = -dashMetrics.bearingY - thickness;
        const bar = new Box(0, y, width, thickness);

        const layout = new Layout([num, den, bar]);
        layout.advance = width;
        return layout;
    }
}

function _flatten(layout, dx = 0, dy = 0, result = []) {
    if (layout.children) {
        dx += layout.x;
        dy += layout.y;
        for (const child of layout.children) {
            _flatten(child, dx, dy, result);
        }
    } else {
        const glyph = layout.clone();
        glyph.x += dx;
        glyph.y += dy;
        result.push(glyph);
    }
    return result;
}

function flatten(layout) {
    return new Layout(_flatten(layout));
}

module.exports = {
    getMetrics,
    createLayout,
    flatten
};

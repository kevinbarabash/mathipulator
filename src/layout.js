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
        this.text = c;
        this.fontSize = fontSize;

        const metrics = getMetrics(c, fontSize);
        this.advance = metrics.advance;
    }

    render(ctx) {
        // TODO when we flatten group all of the items with the same fontSize
        ctx.font = `${this.fontSize}px 100 Helvetica`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class Run {
    constructor(text, fontSize) {
        this.x = 0;
        this.y = 0;
        this.text = text;
        this.fontSize = fontSize;

        this.glyphs = [];

        let penX = 0;

        for (const c of text) {
            const glyph = new Glyph(c, fontSize);
            glyph.x = penX;
            this.glyphs.push(glyph);
            penX += glyph.advance;
        }

        this.advance = penX;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        for (const glyph of this.glyphs) {
            glyph.render(ctx);
        }
        ctx.restore();
    }
}

class Layout {
    constructor(node, fontSize) {
        const spaceMetrics = getMetrics(" ", fontSize);

        this.layout = [];

        // in the case of exponents we'll want to reduce the fontSize
        this.fontSize = fontSize;

        // this is where the layout is located within its parent
        this.x = 0;
        this.y = 0;

        // after a child layout has been created, we update its
        // position to be the current pen position.
        let penX = 0;

        if (node.type === "Literal") {
            const text = String(node.value);
            const run = new Run(text, fontSize);
            run.x = penX;
            penX += run.advance;
            this.layout.push(run);
        } else if (node.type === "Operator") {
            const glyph = new Glyph(node.operator, fontSize);
            glyph.x = penX;
            penX += glyph.advance;
            this.layout.push(glyph);
        } else if (node.type === "Expression") {
            for (let child of node) {
                const layout = new Layout(child, fontSize);
                if (child.type === "Operator") {
                    penX += spaceMetrics.advance;
                }
                layout.x = penX;
                console.log(layout.x);
                penX += layout.advance;
                this.layout.push(layout);
                if (child.type === "Operator") {
                    penX += spaceMetrics.advance;
                }
                penX += layout.advance;
            }
        } else if (node.type === "Equation") {
            const lhs = new Layout(node.left, fontSize);
            const equalGlyph = new Glyph("=", fontSize);
            const rhs = new Layout(node.right, fontSize);
            lhs.x = penX;
            penX += lhs.advance;
            equalGlyph.x = penX;
            penX += equalGlyph.advance;
            rhs.x = penX;
            penX += rhs.advance;
            this.layout.push(lhs);
        }

        this.advance = penX;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        for (const layout of this.layout) {
            layout.render(ctx);
        }
        ctx.restore();
    }
}


module.exports = {
    getMetrics,
    Layout
};

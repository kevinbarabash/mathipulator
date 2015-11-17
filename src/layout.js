const fontMetrics = require("../metrics/helvetica-light.json");

// TODO: handle fonts with different unitsPerEm
const {unitsPerEm, glyphMetrics} = fontMetrics;

function formatText(text) {
    if (parseFloat(text) < 0) {
        text = `(${text})`;
    }
    return String(text).replace(/\-/g, "\u2212");
}

function getMetrics(c, fontSize) {
    const result = {};
    for (const [k, v] of Object.entries(glyphMetrics[c.charCodeAt(0)])) {
        result[k] = fontSize * v / unitsPerEm;
    }
    return result;
}

class Glyph {
    constructor(c, fontSize) {
        this.x = 0;
        this.y = 0;
        this.text = c;
        this.fontSize = fontSize;

        this.metrics = getMetrics(this.text, fontSize);
        this.advance = this.metrics.advance;
    }

    render(ctx) {
        // TODO when we flatten group all of the items with the same fontSize
        if (this.id) {
            ctx.strokeStyle = 'red';
            const bounds = this.bounds;
            ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }

        const weight = 100;
        ctx.font = `${weight} ${this.fontSize}px Helvetica`;
        ctx.fillStyle = 'black';
        ctx.fillText(this.text, this.x, this.y);
    }

    get bounds() {
        const {bearingX, bearingY, width, height} = this.metrics;
        const left = this.x + bearingX;
        const right = left + width;
        const top = this.y - bearingY - height;
        const bottom = top + height;
        return { left, right, top, bottom };
    }

    clone() {
        const result = new Glyph(this.text, this.fontSize);
        Object.assign(result, this);
        return result;
    }

    hitTest(x, y) {
        const {bearingX, bearingY, width, height} = this.metrics;
        const left = bearingX + this.x;
        const right = left + width;
        const top = this.y - bearingY - height;
        const bottom = top + height;
        if (x >= left && x <= right && y >= top && y <= bottom) {
            return this;
        }
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

    hitTest(x, y) { }
}

// TODO: treat short runs such as "25" and "sin" atomic units
class Layout {
    constructor(children, atomic = false) {
        this.x = 0;
        this.y = 0;
        Object.assign(this, {children, atomic});
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.atomic) {
            ctx.strokeStyle = 'red';
            const bounds = this.bounds;
            ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }

        for (const child of this.children) {
            child.render(ctx);
        }
        ctx.restore();
    }

    get bounds() {
        let initialBounds = {
            left: Infinity,
            right: -Infinity,
            top: Infinity,
            bottom: -Infinity
        };

        const bounds = this.children.reduce((bounds, child) => {
            const childBounds = child.bounds;
            return {
                left: Math.min(bounds.left, childBounds.left),
                right: Math.max(bounds.right, childBounds.right),
                top: Math.min(bounds.top, childBounds.top),
                bottom: Math.max(bounds.bottom, childBounds.bottom)
            }
        }, initialBounds);

        return bounds;
    }

    clone() {
        const result = new Layout(this.children.map(child => child.clone()), this.atomic);
        result.id = this.id;
        result.x = this.x;
        result.y = this.y;
        return result;
    }

    hitTest(x, y) {
        // correct for the offset of the layout
        x = x - this.x;
        y = y - this.y;

        if (this.atomic) {
            const bounds = this.bounds;
            if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
                return this;
            }
        }
        for (const child of this.children) {
            const result = child.hitTest(x, y);
            if (result) {
                return result;
            }
        }
    }
}


function formatIdentifier(identifier) {
    if (identifier.length > 1) {
        // TODO: have a fallback when we don't have the glyph
        if (identifier === 'pi') {
            return '\u03C0';
        } else if (identifier === 'theta') {
            return '\u03B8';
        }
    }
    return identifier;
}


function createLayout(node, fontSize) {
    const spaceMetrics = getMetrics(" ", fontSize);
    const dashMetrics = getMetrics("-", fontSize);

    if (node.type === "Literal") {
        const text = formatText(String(node.value));

        let penX = 0;
        const layouts = [];

        for (const c of text) {
            const glyph = new Glyph(c, fontSize);

            glyph.x = penX;
            penX += glyph.advance;

            layouts.push(glyph);
        }

        const layout = new Layout(layouts, true);
        layout.advance = penX;
        layout.id = node.id;
        return layout;
    } else if (node.type === "Identifier") {
        const name = formatIdentifier(node.name);
        // TODO handle multi character identifiers such as sin, cos, tan, etc.
        const glyph = new Glyph(name, fontSize);
        glyph.id = node.id;
        return glyph;
    } else if (node.type === "Operator") {
        const operator = formatText(node.operator);
        const glyph = new Glyph(operator, fontSize);
        glyph.id = node.id;
        return glyph;
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
        layout.id = node.id;
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
        layout.id = node.id;
        return layout;
    } else if (node.type === "Fraction") {
        const num = createLayout(node.numerator, fontSize);
        const den = createLayout(node.denominator, fontSize);

        // TODO: add Box class to actual render divisior bar
        // TODO: use x-height / 2 to determine divisor bar position
        // TODO: use ascender/descender + gap to determine y-shift
        // TODO: use height of numerator/denominator too
        num.y -= fontSize / 2 + 0.05 * fontSize;
        den.y += fontSize / 2 + 0.20 * fontSize;

        // TODO: calc width so that we can use width where it makes sense
        if (den.advance > num.advance) {
            num.x += (den.advance - num.advance) / 2;
        } else {
            den.x += (num.advance - den.advance) / 2;
        }

        const padding = 0.1 * fontSize;

        num.x += padding;
        den.x += padding;

        const width = Math.max(num.advance, den.advance) + 2 * padding;
        const thickness = dashMetrics.height;
        const y = -dashMetrics.bearingY - thickness;
        const bar = new Box(0, y, width, thickness);

        const layout = new Layout([num, den, bar]);
        layout.advance = width;
        layout.id = node.id;
        return layout;
    } else if (node.type === "Product") {
        let penX = 0;
        const layouts = [];
        for (let child of node) {
            // TODO: handle multiple numbers and numbers that come in the middle
            const childLayout = createLayout(child, fontSize);
            childLayout.x = penX;
            penX += childLayout.advance;
            layouts.push(childLayout);
        }
        const layout = new Layout(layouts);
        layout.advance = penX;
        layout.id = node.id;
        return layout;
    }
}

function _flatten(layout, dx = 0, dy = 0, result = []) {
    if (layout.atomic) {
        layout = layout.clone();
        layout.x += dx;
        layout.y += dy;
        result.push(layout);
    } else if (layout.children) {
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

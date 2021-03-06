const fontMetrics = require("../../metrics/helvetica-light.json");

// TODO: handle fonts with different unitsPerEm
const {unitsPerEm, glyphMetrics} = fontMetrics;

const RenderOptions = {
    bounds: false
};

function formatText(text, parens) {
    if (parseFloat(text) < 0 && parens) {
        text = `(${text})`;
    }
    return String(text).replace(/\-/g, "\u2212").replace(/\*/g, "\u00B7");
}

function getMetrics(c, fontSize) {
    const result = {};
    for (const [k, v] of Object.entries(glyphMetrics[c.charCodeAt(0)])) {
        result[k] = fontSize * v / unitsPerEm;
    }
    return result;
}

function getAscent(fontSize) {
    const TMetrics = getMetrics('T', fontSize);
    const descent = getDescent(fontSize);
    return -TMetrics.height - descent; // negative y values are above the baseline
}

function getDescent(fontSize) {
    const yMetrics = getMetrics('y', fontSize);
    return -yMetrics.bearingY;
}

class Glyph {
    constructor(c, fontSize, metrics = getMetrics(c, fontSize)) {
        this.x = 0;
        this.y = 0;
        this.text = c;
        this.fontSize = fontSize;
        this.selectable = true;
        this.ascent = getAscent(fontSize);
        this.descent = getDescent(fontSize);
        this.atomic = true;
        this.metrics = metrics;
        this.advance = this.metrics.advance;
    }

    render(ctx) {
        // TODO when we flatten group all of the items with the same fontSize
        if (this.id && RenderOptions.bounds) {
            ctx.strokeStyle = 'red';
            const bounds = this.getBounds();
            ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }

        const weight = 100;
        ctx.font = `${weight} ${this.fontSize}px Helvetica`;
        ctx.fillText(this.text, this.x, this.y);
    }

    getBounds() {
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
        const { left, right, top, bottom } = this.getBounds();
        if (x >= left && x <= right && y >= top && y <= bottom) {
            return this;
        }
    }
}

class Box {
    constructor(x, y, width, height, stroke = false) {
        Object.assign(this, {x, y, width, height, stroke});
        this.type = 'box';
        this.selectable = true;
    }

    render(ctx) {
        if (this.stroke) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    getBounds() {
        const left = this.x;
        const right = left + this.width;
        const top = this.y;
        const bottom = top + this.height;
        return { left, right, top, bottom };
    }

    get advance() {
        return this.width;
    }

    clone() {
        const result = new Box(this.x, this.y, this.width, this.height);
        result.type = 'box';
        Object.assign(result, this);
        return result;
    }

    hitTest(x, y) {
        const { left, right, top, bottom } = this.getBounds();
        if (x >= left && x <= right && y >= top && y <= bottom) {
            return this;
        }
    }
}

class Layout {
    constructor(children, atomic = false) {
        this.x = 0;
        this.y = 0;
        this.selectable = true;
        Object.assign(this, {children, atomic});
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.atomic && RenderOptions.bounds) {
            ctx.strokeStyle = 'red';
            const bounds = this.getBounds();
            ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }

        for (const child of this.children) {
            child.render(ctx);
        }
        ctx.restore();
    }

    getBounds() {
        let initialBounds = {
            left: Infinity,
            right: -Infinity,
            top: Infinity,
            bottom: -Infinity
        };

        const bounds = this.children.reduce((bounds, child) => {
            const childBounds = child.getBounds();
            return {
                left: Math.min(bounds.left, childBounds.left),
                right: Math.max(bounds.right, childBounds.right),
                top: Math.min(bounds.top, childBounds.top),
                bottom: Math.max(bounds.bottom, childBounds.bottom)
            }
        }, initialBounds);

        bounds.left += this.x;
        bounds.right += this.x;
        bounds.top += this.y;
        bounds.bottom += this.y;

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
        if (this.atomic) {
            const bounds = this.getBounds();
            if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
                return this;
            }
        }
        for (const child of this.children) {
            const result = child.hitTest(x - this.x, y - this.y);
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


function makeMetricsSquare(metrics) {
    if (metrics.width >= metrics.height) {
        const vPad = (metrics.width - metrics.height) / 2;
        return {
            bearingX: metrics.bearingX,
            bearingY: metrics.bearingY - vPad,
            width: metrics.width,
            height: metrics.height + 2 * vPad
        };
    } else {
        const hPad = (metrics.height - metrics.width) / 2;
        return {
            bearingX: metrics.bearingX - hPad,
            bearingY: metrics.bearingY,
            width: metrics.width + 2 * hPad,
            height: metrics.height
        };
    }
}

function startsExpression(node) {
    return node.parent.type === 'Expression' && node.parent.first !== node ||
        node.parent.parent && node.parent.parent.type === 'Expression' && node.parent.parent.first !== node.parent;
}


function createLayout(node, fontSize) {
    const spaceMetrics = getMetrics(" ", fontSize);
    const dashMetrics = getMetrics("\u2212", fontSize);

    if (node.type === "Literal") {
        const parens = startsExpression(node) || node.parent.type === "Product" && node.parent.first !== node;
        const text = formatText(String(node.value), parens);

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

        const ascent = getAscent(fontSize);
        const descent = getDescent(fontSize);

        layout.ascent = ascent;
        layout.descent = descent;

        return layout;
    } else if (node.type === "Identifier") {
        const name = formatIdentifier(node.name);
        // TODO handle multi character identifiers such as sin, cos, tan, etc.
        const glyph = new Glyph(name, fontSize);
        glyph.id = node.id;
        return glyph;
    } else if (node.type === "Negation") {
        const children = [];
        let penX = 0;

        if (startsExpression(node)) {
            const lParen = new Glyph("(", fontSize);
            lParen.x = penX;
            lParen.id = node.id + ":(outer";
            lParen.selectable = false;
            penX += lParen.advance;
            children.push(lParen);
        }

        const negativeSign = new Glyph("\u2212", fontSize);
        negativeSign.x = penX;
        negativeSign.id = node.id + ":-";
        penX += negativeSign.advance;
        children.push(negativeSign);

        if (["Expression", "Product"].includes(node.value.type)) {
            const lParen2 = new Glyph("(", fontSize);
            lParen2.x = penX;
            lParen2.id = node.id + ":(inner";
            penX += lParen2.advance;
            children.push(lParen2);
        }

        const valueLayout = createLayout(node.value, fontSize);
        valueLayout.x = penX;
        penX += valueLayout.advance;
        children.push(valueLayout);

        if (["Expression", "Product"].includes(node.value.type)) {
            const rParen2 = new Glyph(")", fontSize);
            rParen2.x = penX;
            rParen2.id = node.id + ":)inner";
            penX += rParen2.advance;
            children.push(rParen2);
        }

        if (startsExpression(node)) {
            const rParen = new Glyph(")", fontSize);
            rParen.x = penX;
            rParen.id = node.id + ":)outer";
            rParen.selectable = false;
            penX += rParen.advance;
            children.push(rParen);
        }

        const layout = new Layout(children);

        layout.advance = penX;
        layout.id = node.id;
        layout.ascent = valueLayout.ascent;
        layout.descent = valueLayout.descent;

        return layout;
    } else if (node.type === "Operator") {
        const operator = formatText(node.operator);
        const glyph = new Glyph(operator, fontSize);
        if (node.operator === "-") {
            glyph.metrics = makeMetricsSquare(glyph.metrics);
        }
        if (node.operator === "*") {
            // TODO: make some methods for center bounds and getting their centers
            const centerX = glyph.metrics.bearingX + glyph.metrics.width / 2;
            const centerY = glyph.metrics.bearingY + glyph.metrics.height / 2;
            const radius = glyph.metrics.width;
            glyph.metrics.bearingX = centerX - radius;
            glyph.metrics.bearingY = centerY - radius;
            glyph.metrics.width = 2 * radius;
            glyph.metrics.height = 2 * radius;
        }
        glyph.id = node.id;
        glyph.circle = true;
        return glyph;
    } else if (node.type === "Expression") {
        let penX = 0;
        let ascent = 0;
        let descent = 0;

        const layouts = [];

        for (const child of node) {
            const childLayout = createLayout(child, fontSize);

            if (child.type === "Operator") {
                penX += spaceMetrics.advance / 1.5;
            } else if (child.type === "Expression") {
                const lParen = new Glyph("(", fontSize);
                lParen.x = penX;
                lParen.id = child.id + ":(";
                lParen.selectable = false;
                penX += lParen.advance;
                layouts.push(lParen);
            }

            childLayout.x = penX;
            penX += childLayout.advance;

            if (child.type === "Operator") {
                penX += spaceMetrics.advance / 1.5;
            } else if (child.type === "Expression") {
                const rParen = new Glyph(")", fontSize);
                rParen.x = penX;
                rParen.id = child.id + ":)";
                rParen.selectable = false;
                penX += rParen.advance;
                layouts.push(rParen);
            }

            if (childLayout.hasOwnProperty('ascent')) {
                ascent = Math.min(childLayout.ascent, ascent);
            }
            if (childLayout.hasOwnProperty('descent')) {
                descent = Math.max(childLayout.descent, descent);
            }

            layouts.push(childLayout);
        }

        const layout = new Layout(layouts);

        layout.advance = penX;
        layout.id = node.id;

        layout.ascent = ascent;
        layout.descent = descent;

        return layout;
    } else if (node.type === "Equation") {
        let penX = 0;

        const lhs = createLayout(node.left, fontSize);
        lhs.x = penX;
        penX += lhs.advance;

        // TODO: update Equation to handle inequalities
        const equal = new Glyph("=", fontSize);
        equal.circle = true;
        equal.metrics = makeMetricsSquare(equal.metrics);
        // TODO: figure out how to differentiate between layout and equal node
        equal.id = node.id;
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

        const thickness = dashMetrics.height;
        const y = -dashMetrics.bearingY - thickness;

        const gap = 3;
        // y is the top of the fraction bar
        num.y = y + num.y - num.descent - gap;
        den.y = -dashMetrics.bearingY + den.y - den.ascent + gap;

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
        const bar = new Box(0, y, width, thickness);
        bar.id = node.id + ":line";

        const layout = new Layout([num, den, bar]);
        layout.advance = width;
        layout.id = node.id;

        layout.ascent = num.y + num.ascent;
        layout.descent = den.y + den.descent;

        return layout;
    } else if (node.type === "Product") {
        let penX = 0;
        let ascent = 0;
        let descent = 0;

        const layouts = [];

        for (let child of node) {
            // TODO: handle multiple numbers and numbers that come in the middle
            if (child.type === "Expression" || child.type === "Product") {
                const lParen = new Glyph("(", fontSize);
                lParen.x = penX;
                lParen.id = child.id + ":(";
                lParen.selectable = false;
                penX += lParen.advance;
                layouts.push(lParen);
            }
            const childLayout = createLayout(child, fontSize);

            if (childLayout.hasOwnProperty('ascent')) {
                ascent = Math.min(childLayout.ascent, ascent);
            }
            if (childLayout.hasOwnProperty('descent')) {
                descent = Math.max(childLayout.descent, descent);
            }

            if (child.type === "Operator") {
                penX += spaceMetrics.advance / 1.5;
            }

            childLayout.x = penX;
            penX += childLayout.advance;

            if (child.type === "Operator") {
                penX += spaceMetrics.advance / 1.5;
            }

            layouts.push(childLayout);
            if (child.type === "Expression" || child.type === "Product") {
                const rParen = new Glyph(")", fontSize);
                rParen.x = penX;
                rParen.id = child.id + ":)";
                rParen.selectable = false;
                penX += rParen.advance;
                layouts.push(rParen);
            }
        }
        const layout = new Layout(layouts);

        layout.advance = penX;
        layout.id = node.id;

        layout.ascent = ascent;
        layout.descent = descent;

        return layout;
    } else if (node.type === 'Math') {
        return createLayout(node.root, fontSize);
    } else if (node.type === 'Placeholder') {
        const box = new Box(0, 0 - 0.85 * fontSize, fontSize, fontSize, true);
        box.ascent = -0.85 * fontSize;
        box.descent = 0.15 * fontSize;
        box.id = node.id;
        return box;
    } else {
        throw Error(`unrecogized node '${node.type}`);
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

// TODO: separate the centering from the creation of the layout
function createFlatLayout(node, fontSize, width, height) {
    let newLayout = createLayout(node, fontSize);
    let flattenedLayout = flatten(newLayout);

    function findEqual(flatLayout) {
        for (const child of flatLayout.children) {
            if (child.text === "=") {
                return child;
            }
        }
    }

    function translateLayout(flatLayout, dx, dy) {
        for (const child of flatLayout.children) {
            child.x += dx;
            child.y += dy;
        }
    }

    let dx = 0;
    let dy = 0;

    const centerX = width / 2;
    const centerY = height / 2;

    const equalNode = findEqual(flattenedLayout);

    if (equalNode) {
        const bounds = equalNode.getBounds();
        dx = centerX - (bounds.left + bounds.right) / 2;
        dy = centerY - (bounds.top + bounds.bottom) / 2;
    } else {
        const bounds = flattenedLayout.getBounds();
        dx = centerX - (bounds.left + bounds.right) / 2;
        dy = centerY - (bounds.top + bounds.bottom) / 2;
    }

    translateLayout(flattenedLayout, dx, dy);

    return flattenedLayout;
}

function unionBounds(layouts) {
    const bounds = {
        left: Infinity,
        right: -Infinity,
        top: Infinity,
        bottom: -Infinity
    };
    layouts.forEach(layout => {
        const layoutBounds = layout.getBounds();
        bounds.left = Math.min(bounds.left, layoutBounds.left);
        bounds.right = Math.max(bounds.right, layoutBounds.right);
        bounds.top = Math.min(bounds.top, layoutBounds.top);
        bounds.bottom = Math.max(bounds.bottom, layoutBounds.bottom);
    });
    return bounds;
}

module.exports = {
    getMetrics,
    createFlatLayout,
    RenderOptions,
    Layout,
    unionBounds,
};

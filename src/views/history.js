class History {
    constructor() {
        this.steps = [];
        this.current = -1;
    }

    addStep(step) {
        if (this.current < this.steps.length - 1) {
            this.steps = this.steps.slice(0, this.current + 1);
        }
        this.steps.push(step);
        this.current++;
    }

    forward() {
        if (this.current < this.steps.length - 1) {
            this.current++;
        }
    }

    backward() {
        if (this.current > 0) {
            this.current--;
        }
    }

    getCurrentStep() {
        return this.steps[this.current];
    }

    getStep(i) {
        return this.steps[i];
    }

    [Symbol.iterator]() {
        return this.steps[Symbol.iterator]();
    }

    get length() {
        return this.steps.length;
    }

    clone() {
        const clone = new History();
        clone.steps = [...this.steps];
        clone.current = this.current;
        return clone;
    }
}

module.exports = History;

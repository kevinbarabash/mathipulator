import ListNode from './node'
import f from 'functify'

export default class Product extends ListNode {
    constructor(...nodes) {
        super();
        this.type = 'Product';
        this.append(...nodes);
    }

    toString() {
        return `${this.type}:${super.toString()}`;
    }

    clone() {
        return new Product(...f(this).map(x => x.clone()));
    }
}

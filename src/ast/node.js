let _id = 0;

//export default class Node {
//    constructor() {
//        this.id = _id++;
//    }
//}

export default class Node {
    constructor() {
        this.id = _id++;
        this.parent = null;
        this.next = null;
        this.prev = null;
    }
}

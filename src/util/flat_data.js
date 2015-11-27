'use strict';

class List {
    constructor(data, list) {
        this.data = data;
        this.list = list;
    }

    append(item) {
        var data = this.data;
        var list = this.list;
        
        if (list.first == null && list.last == null) {
            list.first = item.id;
            list.last = item.id;

            item.prev = null;
            item.next = null;
            item.parent = list.id;
        } else {
            var last = data[list.last];
            last.next = item.id;

            item.prev = last.id;
            item.next = null;
            item.parent = list.id;

            list.last = item.id;
        }
    }
    
    forEach(callback) {
        var data = this.data;
        var list = this.list;
        
        var node = data[list.first];
        while (node) {
            callback(node.value);
            node = data[node.next];
        }
    }
}

// nodes have different types
// when you want to create a node of a certain type, you create it
// when you want to access a node of a certain type, you ask for a wrapper around the data.

class FlatData {
    constructor() {
        this.data = {};
        this.id = 0;
    }
    
    createNode() {
        var node = {
            id: this.id++,
            parent: null,
            next: null,
            prev: null
        };
        this.data[node.id] = node;
        return node;
    }
    
    createList() {
        var list = this.createNode();
        list.type = 'ListNode';
        list.first = null;
        list.last = null;
        return new List(this.data, list);
    }
    
    createLiteral(value) {
        var node = this.createNode();
        node.type = 'Literal';
        node.value = value;
        return node;
    }
    
    getNodeById(id) {
        var node = this.data[id];
        if (node.type === 'ListNode') {
            return new List(node);
        }
        return node;
    }
}


var doc = new FlatData();
var list2 = doc.createList();

list2.append(doc.createLiteral(5));
list2.append(doc.createLiteral(10));
list2.append(doc.createLiteral(15));

list2.forEach(value => {
    console.log(value);
});

console.log("hello");

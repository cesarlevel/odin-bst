class Node {
    constructor(data = null) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array = []) {
        this.array = array;
        this.sortedArray = this.sortAndRemoveDuplicates(this.array);
        this.root = this.buildTree();
    }

    sortAndRemoveDuplicates(array) {
        return [...new Set(array)].sort((a, b) => a - b);
    }

    buildTree(
        array = this.sortedArray,
        start = 0,
        end = array.length - 1
    ) {
        if (start > end) return null;

        let mid = parseInt((start + end) / 2);
        const node = new Node(array[mid]);

        node.left = this.buildTree(array, start, mid - 1);
        node.right = this.buildTree(array, mid + 1, end);

        return node;
    }

    insert(value) {
        this.root = this.insertValue(value);
    }

    insertValue(value, root = this.root) {
        if (root === null) {
            return new Node(value);
        }

        if (value < root.data) {
            root.left = this.insertValue(value, root.left);
        } else if (value > root.data) {
            root.right = this.insertValue(value, root.right);
        }

        return root;
    }

    delete(value) {
        this.root = this.deleteValue(value);
    }

    deleteValue(value, root = this.root) {
        if (root === null) {
            return root;
        }

        if (value < root.data) {
            root.left = this.deleteValue(value, root.left);
        } else if (value > root.data) {
            root.right = this.deleteValue(value, root.right);
        } else {
            if (root.left === null) {
                return root.right;
            } else if (root.right === null) {
                return root.left;
            }
            root.data = this.minValue(root.right);
            root.right = this.deleteValue(root.data, root.right);
        }
        return root;
    }

    minValue(root) {
        let mv = root.data;
        
        while (root.left !== null) {
            mv = root.left.data;
            root = root.left
        }
        return mv;
    }

    find(value) {
        return this.findValue(value);
    }

    findValue(value, root = this.root) {
        if (root.data === value) {
            return root;
        }

        if (value < root.data) {
            return this.findValue(value, root.left);
        } else {
            return this.findValue(value, root.right);
        }
    }

    processFuncOnValues(values, func) {
        if (func) {
            return values.map(func);
        }
        
        return values;
    }

    levelOrder(func = null) {
        if (this.root === null) return;

        const queue = [this.root];
        const values = [];

        while (queue.length) {
            const [node] = queue;
            const {data, left = null, right = null} = node;

            if (left) {
                queue.push(left);
            }
            if (right) {
                queue.push(right);
            }

            values.push(data);
            queue.shift();
        }

        return this.processFuncOnValues(values, func);
    }

    preorder(func = null) {
        const values = this.depthFirstValues();

        return this.processFuncOnValues(values, func);
    }

    inorder(func = null) {
        const values =  this.depthFirstValues('inorder');

        return this.processFuncOnValues(values, func);
    }

    postorder(func = null) {
        const values = this.depthFirstValues('postorder');

        return this.processFuncOnValues(values, func);
    }

    depthFirstValues(type = 'preorder', root = this.root, array = []) {
        if (root === null) {
            return array
        };

        if (type === 'preorder') {
            array.push(root.data);
            this.depthFirstValues(type, root.left, array);
            this.depthFirstValues(type, root.right, array);
        } else if (type === 'inorder') {
            this.depthFirstValues(type, root.left, array);
            array.push(root.data);
            this.depthFirstValues(type, root.right, array);
        } else if (type === 'postorder') {
            this.depthFirstValues(type, root.left, array);
            this.depthFirstValues(type, root.right, array);
            array.push(root.data);
        }

        return array;
    }

    height(root = this.root) {
        return this.calcHeight(root);
    }

    calcHeight(root) {
        if (root === null) {
            return - 1;
        }

        let left = this.calcHeight(root.left);
        let right = this.calcHeight(root.right);

        return Math.max(left, right) + 1;
    }

    depth(root = this.root) {
        return Math.abs(this.calcDepth(root));
    }

    calcDepth(root) {
        if (root === null) {
            return -this.height() + this.height(root);
        }

        let left = this.calcDepth(root.left);
        let right = this.calcDepth(root.right);

        return Math.max(left, right) + 1;
    }

    rebalance() {
        if (this.isBalanced) return;

        this.array = this.levelOrder();
        this.sortedArray = this.sortAndRemoveDuplicates(this.array);
        this.root = this.buildTree();
    }

    get isBalanced() {
        const {left, right} = {
            left: this.height(this.root.left) + 1,
            right: this.height(this.root.right) + 1,
        }

        return Math.abs(left - right) <= 1;
    }
}

const array = [1,2,3,4,5,6,7,8,9];
const tree = new Tree(array);

const test = new Node(3)

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
}

tree.insert(10)
tree.delete(10)
tree.insert(20)
tree.insert(30)
tree.insert(40)
console.log(tree.find(3))
console.log(tree.levelOrder())
console.log(tree.preorder())
console.log(tree.height())
console.log(tree.depth())
console.log(tree.isBalanced)
console.log(tree.rebalance())
console.log(prettyPrint(tree.root))

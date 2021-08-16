import {Node} from './Node';

const topIndex = 0;
const left = (index: number) => (index << 1) + 1;
const right = (index: number) => (index + 1) << 1;
const parent = (index: number) => ((index + 1) >>> 1) - 1;

export class Heap {
    readonly _heap: Node[];
    readonly _comparator;

    constructor(comparator = (nodeA: Node, nodeB: Node) => nodeA.f < nodeB.f) {
        this._heap = [];
        this._comparator = comparator;
    }

    size(): number {
        return this._heap.length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    peek(): Node {
        return this._heap[topIndex];
    }

    push(...nodes: Node[]): number {
        nodes.forEach(node => {
            this._heap.push(node);
            this.siftUp();
        });

        return this.size();
    }

    pop(): Node | undefined {
        const root = this.peek();
        const bottomIndex = this.size() - 1;
        if (bottomIndex > topIndex) {
            this.swap(bottomIndex, topIndex);
        }
        this._heap.pop();
        this.siftDown();

        return root;
    }

    private greater(i: number, j: number): boolean {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    private swap(i: number, j: number): void {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    private siftUp(): void {
        let nodeIndex = this.size() - 1;
        while (nodeIndex > topIndex && this.greater(nodeIndex, parent(nodeIndex))) {
            this.swap(nodeIndex, parent(nodeIndex));
            nodeIndex = parent(nodeIndex);
        }
    }

    private siftDown(): void {
        let nodeIndex = topIndex;
        while ((left(nodeIndex) < this.size() && this.greater(left(nodeIndex), nodeIndex)) ||
            (right(nodeIndex) < this.size() && this.greater(right(nodeIndex), nodeIndex))) {
                let maxChild = (right(nodeIndex) < this.size() && this.greater(right(nodeIndex), left(nodeIndex))) ?
                    right(nodeIndex) : left(nodeIndex);
                this.swap(nodeIndex, maxChild);
                nodeIndex = maxChild;
            }
    }
}

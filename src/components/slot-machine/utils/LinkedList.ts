class LinkedListNode {
    // value -1は番兵、LinkedListが初回生成時のクリーンな状態なのかどうかを判定するために使う
    value: number
    next?: LinkedListNode // -1でやろうとするとMaximum call stack size exceededが出て無限再起になってしまう
    constructor(value: number) {
        this.value = value
        this.next = undefined
    }
}

/**
 * 連結リスト
 */
export default class LinkedList {
    private head: LinkedListNode
    private currentNode: LinkedListNode
    constructor() {
        this.head = new LinkedListNode(-1)
        this.currentNode = new LinkedListNode(-1)
    }
    /**
     * 連結リストの最終項に新しい要素を追加する
     * @param value 連結リストに追加したい自然数の数値
     */
    public push(value: number): void {
        if(!Number.isInteger(value) || Math.sign(value) === -1) throw new TypeError("valueには必ず自然数を入力してください")
        const node = new LinkedListNode(value)
        // 初回挿入時
        if (this.head.value === -1) {
            this.head = node
            this.currentNode = node
            return
        }
        let endNode = this.head
        while (endNode.next) {
            endNode = endNode.next
        }
        endNode.next = node
    }
    /**
     * @returns 選択されている要素から数値を返す。連結リストに何も要素が無い場合は、undefinedを返す。
     */
    public getCurrentNum(): number {
        if(this.head.value === -1) throw new ReferenceError("No items in the LinkedList. please push item first.")
        return this.currentNode.value
    }
    /**
     * @returns 選択されている要素から連続する3つの数値を返す。
     */
    public getThreeConsecutivedNum(): number[] {
        if(this.head.value === -1) throw new ReferenceError("No items in the LinkedList. please push item first.")
        const firstNode = this.currentNode
        const secondNode = firstNode.next ? firstNode.next : this.head
        const thirdNode = secondNode.next ? secondNode.next : this.head
        return [
            firstNode.value,
            secondNode.value,
            thirdNode.value
        ]
    }
    /**
     * 次の要素を選択する。既に最後列に到達していた場合は、先頭を選択する。(リストを巡回させる)
     */
    public next(): void {
        if(this.head.value === -1) throw new ReferenceError("No items in the LinkedList. please push item first.")
        if(this.currentNode.next) this.currentNode = this.currentNode.next
        else this.currentNode = this.head
    }
}
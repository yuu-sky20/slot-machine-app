class LinkedListNode {
    value: number
    next: LinkedListNode | undefined
    constructor(value: number) {
        this.value = value
        this.next = undefined
    }
}

/**
 * 連結リスト
 */
export default class LinkedList {
    head: LinkedListNode | undefined
    currentNode: LinkedListNode | undefined
    constructor() {
        this.head = undefined
        this.currentNode = undefined
    }
    /**
     * 連結リストの最終項に新しい要素を追加する
     * @param value 連結リストに追加したい数値
     */
    public push(value: number): void {
        const node = new LinkedListNode(value)
        // 初回挿入時
        if (!this.head) {
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
        return this.currentNode!.value
    }
    /**
     * unsafe
     * @returns 選択されている要素から連続する3つの数値を返す。
     */
    public getThreeConsecutivedNum(): number[] {
        const firstNode = this.currentNode!
        const secondNode = firstNode?.next ? firstNode!.next : this.head!
        const thirdNode = secondNode?.next ? secondNode!.next : this.head!
        return [
            firstNode.value,
            secondNode.value,
            thirdNode.value
        ]
    }
    /**
     * 次の要素を選択する。既に最後列に到達していた場合は、先頭を選択する。
     */
    public next(): void {
        if(this.currentNode?.next) this.currentNode = this.currentNode?.next
        else if(this.head && !this.currentNode?.next) this.currentNode = this.head
    }
}
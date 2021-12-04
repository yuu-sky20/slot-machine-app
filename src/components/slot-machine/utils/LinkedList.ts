import {ArgumentRangeError, LinkedListReferenceError} from "../../../const/errorCodes"
/** LinkedListが初回生成時のクリーンな状態なのかどうかを判定するために使う */
const SENTINEL = -1
class LinkedListNode {
    value: number
    next?: LinkedListNode // -1でやろうとするとMaximum call stack size exceededが出て無限再起になってしまう
    constructor(value: number) {
        this.value = value
        this.next = undefined
    }
}

/** 連結リスト */
export default class LinkedList {
    private head: LinkedListNode
    private currentNode: LinkedListNode
    constructor() {
        this.head = new LinkedListNode(SENTINEL)
        this.currentNode = new LinkedListNode(SENTINEL)
    }
    /**
     * 連結リストの最終項に新しい要素を追加する
     * @param value 連結リストに追加したい自然数の数値
     */
    public push(value: number): void {
        if(!Number.isInteger(value) || Math.sign(value) === -1) throw new TypeError(ArgumentRangeError.NotNaturalNumber)
        const node = new LinkedListNode(value)
        // 初回挿入時
        if (this.head.value === SENTINEL) {
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
    /** 1つ以上の要素が存在しない場合にその行が実行されたらエラーを投げる */
    private CheckHeadSameAsSENTINEL() {
        if(this.head.value === SENTINEL) throw new ReferenceError(LinkedListReferenceError.ItemDoesNotExit)
    }
    /**
     * @returns 選択されている要素から数値を返す。連結リストに何も要素が無い場合は、undefinedを返す。
     */
    public getCurrentNum(): number {
        this.CheckHeadSameAsSENTINEL()
        return this.currentNode.value
    }
    /**
     * @returns 選択されている要素から連続する3つの数値を返す。
     */
    public getThreeConsecutivedNum(): number[] {
        this.CheckHeadSameAsSENTINEL()
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
        this.CheckHeadSameAsSENTINEL()
        if(this.currentNode.next) this.currentNode = this.currentNode.next
        else this.currentNode = this.head
    }
}
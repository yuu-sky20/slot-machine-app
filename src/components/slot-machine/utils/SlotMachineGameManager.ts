/** ゲームのクリア条件に関するデータ、メソッドを提供する */
export default class GameManager {
    private firstItem: number
    private isGameClear: boolean
    private slotStoppedCount: number
    constructor() {
        this.firstItem = 0
        this.isGameClear = true
        this.slotStoppedCount = 0
    }
    /** ゲーム設定をリセットする */
    public resetGame() {
        this.firstItem = 0
        this.isGameClear = true
        this.slotStoppedCount = 0
    }
    /**
     * 中央横ラインのスロットアイテムが揃っているか判定する
     * 3回手動で呼び出す
     * @param currentSlotMiddleItem ストップしたスロットの中央のアイテム
     * @returns 現在のスロットがリーチ状態かどうかboolで返す
     */
    public judgeSlotHorizontalLine(currentSlotMiddleItem: number): boolean {
        if(!Number.isInteger(currentSlotMiddleItem) || Math.sign(currentSlotMiddleItem) === -1) throw new TypeError("引数には必ず自然数を入力してください")
        let isSlotReachNow = false

        if (this.slotStoppedCount === 0) this.firstItem = currentSlotMiddleItem
        if (this.slotStoppedCount === 1 && this.firstItem === currentSlotMiddleItem) isSlotReachNow = true
        if (this.firstItem !== currentSlotMiddleItem) this.isGameClear = false

        this.slotStoppedCount++
        return isSlotReachNow
    }
    /**
     * @returns ゲームクリア条件を満たしたかどうかをbool値で返す
     */
    public isGameCleared(): boolean {
        return this.isGameClear
    }
}
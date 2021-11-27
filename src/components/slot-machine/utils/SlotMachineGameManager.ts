export class GameManager {
    private firstItemNum: number
    private isClear: boolean
    private count: number
    constructor() {
        this.firstItemNum = 0
        this.isClear = true
        this.count = 0
    }
    /**
     * ゲーム設定をリセットする
     */
    public ResetGame(): void {
        this.firstItemNum = 0
        this.isClear = true
        this.count = 0
    }
    /**
     * 中央横ラインのスロットアイテムが揃っているか判定する
     * @param indexNum ストップした現在のmiddleSlotItemのemojiItems[]の添字番号 
     */
    public JudgeSlotHorizontalLine(indexNum: number): void {
        if(!Number.isInteger(indexNum) || Math.sign(indexNum) === -1) throw new TypeError("indexNumには必ず自然数を入力してください")

        if (this.count === 0) this.firstItemNum = indexNum
        if (this.firstItemNum !== indexNum) this.isClear = false
        this.count++
    }
    /**
     * @returns ゲームクリア条件を満たしたかどうかをbool値で返す
     */
    public IsGameClear(): boolean {
        return this.isClear
    }
}
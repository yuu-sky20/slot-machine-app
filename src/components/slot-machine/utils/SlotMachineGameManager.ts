export default class GameManager {
    private firstItemNum: number
    private isGameClear: boolean
    private slotStoppedCount: number
    private gamePlayCount: number
    constructor() {
        this.firstItemNum = 0
        this.isGameClear = true
        this.slotStoppedCount = 0
        this.gamePlayCount = 0
    }
    /**
     * ゲーム設定をリセットする
     */
    public resetGame(): void {
        this.firstItemNum = 0
        this.isGameClear = true
        this.slotStoppedCount = 0
    }
    /**
     * 中央横ラインのスロットアイテムが揃っているか判定する
     * 3回手動で呼び出す
     * @param indexNum ストップした現在のmiddleSlotItemのemojiItems[]の添字番号 
     */
    public judgeSlotHorizontalLine(indexNum: number): void {
        if(!Number.isInteger(indexNum) || Math.sign(indexNum) === -1) throw new TypeError("indexNumには必ず自然数を入力してください")

        if (this.slotStoppedCount === 0) {
            this.firstItemNum = indexNum
            this.gamePlayCount++
        }
        if (this.firstItemNum !== indexNum) this.isGameClear = false
        this.slotStoppedCount++
    }
    /**
     * @returns ゲームクリア条件を満たしたかどうかをbool値で返す
     */
    public isGameCleared(): boolean {
        return this.isGameClear
    }
    /**
     * @returns ゲームのプレイ回数を返す
     */
    public getGamePlayCount(): number {
        return this.gamePlayCount
    }
}
import GameManager from "./SlotMachineGameManager";

describe("正常にゲームクリアされるか", () => {
    it("ゲームクリアされる1", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.judgeSlotHorizontalLine(6)
        expect(gameManager.isGameCleared()).toBeTruthy()
    })
    it("ゲームクリアされる2", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(0)
        gameManager.judgeSlotHorizontalLine(0)
        gameManager.judgeSlotHorizontalLine(0)
        expect(gameManager.isGameCleared()).toBeTruthy()
    })
    it("ゲームクリアされる3", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(14)
        gameManager.judgeSlotHorizontalLine(14)
        gameManager.judgeSlotHorizontalLine(14)
        gameManager.judgeSlotHorizontalLine(14)
        gameManager.judgeSlotHorizontalLine(14)
        expect(gameManager.isGameCleared()).toBeTruthy()
    })

    it("ゲームクリアされない1", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(2)
        gameManager.judgeSlotHorizontalLine(3)
        gameManager.judgeSlotHorizontalLine(2)
        expect(gameManager.isGameCleared()).toBeFalsy()
    })
    it("ゲームクリアされない2", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(5)
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.judgeSlotHorizontalLine(0)
        expect(gameManager.isGameCleared()).toBeFalsy()
    })
    it("ゲームクリアされない3", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(9)
        gameManager.judgeSlotHorizontalLine(9)
        gameManager.judgeSlotHorizontalLine(9)
        gameManager.judgeSlotHorizontalLine(10)
        expect(gameManager.isGameCleared()).toBeFalsy()
    })
})
describe("正常にゲームリセットされるかどうか", () => {
    it("ゲームリセットされる1", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(2)
        gameManager.judgeSlotHorizontalLine(3)
        gameManager.judgeSlotHorizontalLine(2)
        gameManager.resetGame()
        expect(gameManager.isGameCleared()).toBeTruthy()
        expect(gameManager.getGamePlayCount()).toBe(1)
    })
    it("ゲームリセットされる2", () => {
        const gameManager = new GameManager()
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.judgeSlotHorizontalLine(6)
        gameManager.resetGame()
        gameManager.judgeSlotHorizontalLine(10)
        gameManager.judgeSlotHorizontalLine(10)
        gameManager.judgeSlotHorizontalLine(6)
        expect(gameManager.isGameCleared()).toBeFalsy()
        expect(gameManager.getGamePlayCount()).toBe(2)
    })
})
describe("judgeSlotHorizontalLine()の引数indexNumの境界値テスト", () => {
    it("indexNumは小数を含まない", () => {
        const gameManager = new GameManager()
        expect(() => gameManager.judgeSlotHorizontalLine(3.9)).toThrow("indexNumには必ず自然数を入力してください")
        expect(() => gameManager.judgeSlotHorizontalLine(12.7834)).toThrow("indexNumには必ず自然数を入力してください")
    })
    it("indexNumは負数を含まない", () => {
        const gameManager = new GameManager()
        expect(() => gameManager.judgeSlotHorizontalLine(-1)).toThrow("indexNumには必ず自然数を入力してください")
        expect(() => gameManager.judgeSlotHorizontalLine(-125)).toThrow("indexNumには必ず自然数を入力してください")
    })
})
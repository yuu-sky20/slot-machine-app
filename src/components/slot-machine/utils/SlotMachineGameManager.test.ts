import { GameManager } from "./SlotMachineGameManager";

describe("正常にゲームクリアされるか", () => {
    it("ゲームクリアされる1", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.JudgeSlotHorizontalLine(6)
        expect(gameManager.IsGameClear()).toBeTruthy()
    })
    it("ゲームクリアされる2", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(0)
        gameManager.JudgeSlotHorizontalLine(0)
        gameManager.JudgeSlotHorizontalLine(0)
        expect(gameManager.IsGameClear()).toBeTruthy()
    })
    it("ゲームクリアされる3", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(14)
        gameManager.JudgeSlotHorizontalLine(14)
        gameManager.JudgeSlotHorizontalLine(14)
        gameManager.JudgeSlotHorizontalLine(14)
        gameManager.JudgeSlotHorizontalLine(14)
        expect(gameManager.IsGameClear()).toBeTruthy()
    })

    it("ゲームクリアされない1", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(2)
        gameManager.JudgeSlotHorizontalLine(3)
        gameManager.JudgeSlotHorizontalLine(2)
        expect(gameManager.IsGameClear()).toBeFalsy()
    })
    it("ゲームクリアされない2", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(5)
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.JudgeSlotHorizontalLine(0)
        expect(gameManager.IsGameClear()).toBeFalsy()
    })
    it("ゲームクリアされない3", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(9)
        gameManager.JudgeSlotHorizontalLine(9)
        gameManager.JudgeSlotHorizontalLine(9)
        gameManager.JudgeSlotHorizontalLine(10)
        expect(gameManager.IsGameClear()).toBeFalsy()
    })
})
describe("正常にゲームリセットされるかどうか", () => {
    it("ゲームリセットされる1", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(2)
        gameManager.JudgeSlotHorizontalLine(3)
        gameManager.JudgeSlotHorizontalLine(2)
        gameManager.ResetGame()
        expect(gameManager.IsGameClear()).toBeTruthy()
    })
    it("ゲームリセットされる2", () => {
        const gameManager = new GameManager()
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.JudgeSlotHorizontalLine(6)
        gameManager.ResetGame()
        gameManager.JudgeSlotHorizontalLine(10)
        gameManager.JudgeSlotHorizontalLine(10)
        gameManager.JudgeSlotHorizontalLine(6)
        expect(gameManager.IsGameClear()).toBeFalsy()
    })
})
describe("JudgeSlotHorizontalLine()の引数indexNumの境界値テスト", () => {
    it("indexNumは小数を含まない", () => {
        const gameManager = new GameManager()
        expect(() => gameManager.JudgeSlotHorizontalLine(3.9)).toThrow("indexNumには必ず自然数を入力してください")
        expect(() => gameManager.JudgeSlotHorizontalLine(12.7834)).toThrow("indexNumには必ず自然数を入力してください")
    })
    it("indexNumは負数を含まない", () => {
        const gameManager = new GameManager()
        expect(() => gameManager.JudgeSlotHorizontalLine(-1)).toThrow("indexNumには必ず自然数を入力してください")
        expect(() => gameManager.JudgeSlotHorizontalLine(-125)).toThrow("indexNumには必ず自然数を入力してください")
    })
})
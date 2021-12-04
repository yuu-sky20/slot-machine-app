import GenerateRandIndexes from "./GenerateRandIndexes"
import {ArgumentRangeError} from "../../../const/errorCodes"

describe('配列が正常に生成されるかどうか', () => {
    it("境界内の数値が使われているかどうか", () => {
        for (let k = 0; k < 10; k++) {
            const match = [0,1,2,3,4,5,6,7,8,9,10]
            const length = match.length
            const randIndexes = GenerateRandIndexes(length)
            console.log("randIndexes: " + randIndexes)
            for (let i = 0; i < length; i++) {
                expect(match).toContain(randIndexes[i])
            }
        }
    })
})

describe("境界値テスト", () => {
    it("0は含まれない", () => {
        expect(() => GenerateRandIndexes(0)).toThrow(ArgumentRangeError.NotGreaterThanOne)
    })
    it("小数は含まれない", () => {
        expect(() => GenerateRandIndexes(2.45)).toThrow(ArgumentRangeError.NotGreaterThanOne)
        expect(() => GenerateRandIndexes(3.141592)).toThrow(ArgumentRangeError.NotGreaterThanOne)
    })
    it("負数は含まれない", () => {
        expect(() => GenerateRandIndexes(-1)).toThrow(ArgumentRangeError.NotGreaterThanOne)
        expect(() => GenerateRandIndexes(-500)).toThrow(ArgumentRangeError.NotGreaterThanOne)
    })
})
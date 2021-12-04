import LinkedList from "./LinkedList"
import {ArgumentRangeError, LinkedListReferenceError} from "../../../const/errorCodes"

describe("エラーハンドリング", () => {
    it("アイテム未挿入時にpush以外のメソッドを呼び出すとエラーが返される", () => {
        const linkedList = new LinkedList()
        expect(() => linkedList.next()).toThrow(LinkedListReferenceError.ItemDoesNotExit)
        expect(() => linkedList.getCurrentNum()).toThrow(LinkedListReferenceError.ItemDoesNotExit)
        expect(() => linkedList.getThreeConsecutivedNum()).toThrow(LinkedListReferenceError.ItemDoesNotExit)
    })
    it("pushできるのは自然数だけ", () => {
        const linkedList = new LinkedList()
        expect(() => linkedList.push(-1)).toThrow(ArgumentRangeError.NotNaturalNumber)
        expect(() => linkedList.push(-54)).toThrow(ArgumentRangeError.NotNaturalNumber)
        expect(() => linkedList.push(11.24)).toThrow(ArgumentRangeError.NotNaturalNumber)
        expect(() => linkedList.push(-11.24)).toThrow(ArgumentRangeError.NotNaturalNumber)
    })
    it("push一回だけの状態でnextを呼び出すとheadと同じ要素をgetメソッドで返す", () => {
        const val = 6
        const linkedList = new LinkedList()
        linkedList.push(val)
        linkedList.next()
        expect(linkedList.getCurrentNum()).toBe(val)
        expect(linkedList.getThreeConsecutivedNum()).toEqual(expect.arrayContaining([val, val, val]))
    })
})

function PatrolLinkedList(matchArray: number[]) {
        const linkedList = new LinkedList()
        matchArray.forEach(v => {
            linkedList.push(v)
        })
        matchArray.forEach(v => {
            expect(linkedList.getCurrentNum()).toBe(v)
            linkedList.next()
        })
        expect(linkedList.getCurrentNum()).toBe(matchArray[0])
}

describe("内容が正常に保存できるか", () => {
    const matchArray = [0,1,2,3,4]
    const matchArray2 = [9,9,5,5,5,2]
    const matchArray3 = [132, 4517, 9]
    it("nextの巡回はできているか", () => {
        PatrolLinkedList(matchArray)
        PatrolLinkedList(matchArray2)
        PatrolLinkedList(matchArray3)
    })
})
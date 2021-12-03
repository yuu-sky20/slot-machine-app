/**
 * 配列へのランダムなアクセス順を生成する
 * 返される数列は必ず0からlength未満の全ての自然数がランダム順で含まれる
 * @param length 配列の長さ
 * @returns 配列へのランダムなアクセス順をnumber[]で返す
 */
export default function GenerateRandIndexes(length: number): number[] {
    if(!Number.isInteger(length) || Math.sign(length) === -1 || Math.sign(length) === 0) throw new TypeError("lengthには必ず1以上の整数値を入力してください")
    const arrayNum: number[] = new Array(length)
    for (let i = 0; i < length; i++){
        arrayNum[i] = i
    }
    let randIndexes: number[] = arrayNum.slice()
    for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * length)
        const y = Math.floor(Math.random() * length)
        randIndexes = Swap(randIndexes, x, y)
    }
    return randIndexes
}

/**
 * 配列内の2つの数値を入れ替える
 * @param array Array<number>
 * @param x index1
 * @param y index2
 * @returns swappedArray[]
 */
function Swap(array: number[], x: number, y: number): number[] {
    array[x] = [array[y], array[y] = array[x]][0]
    return array
}
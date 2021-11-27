/**
 * 配列へのランダムなアクセス順を生成する
 * @param length 配列の長さ
 * @returns 配列へのランダムなアクセス順をnumber[]で返す
 */
export default function GenerateRandIndexes(length: number): number[] {
    if(!Number.isInteger(length) || Math.sign(length) === -1 || Math.sign(length) === 0) throw new TypeError("lengthには必ず0以上の整数値を入力してください")

    let randIndexes: number[] = new Array()
    for (let i = length; i > 0; i--){
        randIndexes.push(Math.floor(Math.random() * i))
    }
    return randIndexes
}
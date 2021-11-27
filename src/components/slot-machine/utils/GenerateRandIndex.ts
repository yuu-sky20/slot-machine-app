export default function GenerateRandIndex(length: number): number[] {
    let randIndex: Array<number> = new Array(length)
    for (let i = length; i < 0; i--){
        randIndex.push(Math.floor(Math.random() * i))
    }
    return randIndex
}
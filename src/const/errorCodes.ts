const ArgumentRangeError = {
    ThreeElementsMissing: "配列引数valuesには3つの要素が必要です。",
    NotNaturalNumber: "引数には必ず自然数を入力してください",
    NotGreaterThanOne: "lengthには必ず1以上の整数値を入力してください"
} as const

const LinkedListReferenceError = {
    ItemDoesNotExit: "連結リスト内にアイテムが存在しません。先に要素をpushしてください。"
} as const

export { ArgumentRangeError, LinkedListReferenceError }
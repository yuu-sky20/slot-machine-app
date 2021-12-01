const Difficulty = {
    EASY: 400,
    NORMAL: 300,
    HARD: 200,
    VERYHARD: 100,
    IMPOSSIVLE: 0
} as const
// as const を用いることにより、type of <T> したときにEASY~IMPOSSIVLEのunion型名が帰ってくる

export default Difficulty
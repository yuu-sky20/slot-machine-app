const DEFAULT_DIFFICULTY_NAME = "NORMAL"

const RollSpeedByDifficulties = {
    EASY: 400,
    NORMAL: 300,
    HARD: 200,
    VERYHARD: 100,
    IMPOSSIVLE: 0
} as const

export default RollSpeedByDifficulties
export {DEFAULT_DIFFICULTY_NAME}
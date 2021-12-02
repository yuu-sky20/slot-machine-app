<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import GameManager from './utils/SlotMachineGameManager'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import RollSpeedByDifficulties from '../../const/rollSpeedByDifficulties'
import { reactive, ref, computed } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

const gameManager = new GameManager()

const gamePlayCount = ref(0)
const bigCount = ref(0)
const isSlotReachNow = ref(false)
const isGameCleared = ref(false)
const isOnceCalledReset = ref(false)
const isStartedFinalSlotRoll = ref(false)
const BASE_ROLL_SPEED = ref(300)

/**
 * スロットのランダムな回転速度を生成
 * @returns 難易度選択により上限値が制御された回転速度の乱数
*/
function GenerateRandSlotRollSpeed(): number {
    return (Math.floor(Math.random() * 100)) + BASE_ROLL_SPEED.value
}

type SlotTurnSpeed = {
    leftSpeed: number,
    middleSpeed: number,
    rightSpeed: number
}
// 各スロットの回転速度
const slotTurnSpeed = reactive<SlotTurnSpeed>({
    leftSpeed: GenerateRandSlotRollSpeed(),
    middleSpeed: GenerateRandSlotRollSpeed(),
    rightSpeed: GenerateRandSlotRollSpeed()
})

// 各スロットのアイテムの中身(emojiItems[]の添字番号)を連結リストで管理
const leftSlotLinkedList = new LinkedList()
const middleSlotLinkedList = new LinkedList()
const rightSlotLinkedList = new LinkedList()
// 各連結リストを初期化
let randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => leftSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => middleSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => rightSlotLinkedList.push(index))

// スロット内の3つのアイテムを一元管理するための型
type SlotItems = {
    top: number,
    middle: number,
    bottom: number
}
/**
 * 引数に与えられた数列から、新しいSlotItems型を生成し、返す
 * @param values 新しく生成するslotItemsの各プロパティに代入したい数値の配列
 * @returns slotItems型を返す
 */
function InitializeSlotItems(values: number[]): SlotItems {
    if(values[0] == null || values[1] == null || values[2] == null) throw new RangeError("配列引数valuesには3つの要素が必要です。")
    const slotItems: SlotItems = {
        top: values[0],
        middle: values[1],
        bottom: values[2]
    }
    return slotItems
}

// UI上で描画するスロット内の3つのアイテムの中身をSlotItems型の可変変数で管理する
// ここの行では初期値を代入している
const leftSlotItems
    = reactive(InitializeSlotItems(leftSlotLinkedList.getThreeConsecutivedNum().reverse()))
const middleSlotItems
    = reactive(InitializeSlotItems(middleSlotLinkedList.getThreeConsecutivedNum().reverse()))
const rightSlotItems
    = reactive(InitializeSlotItems(rightSlotLinkedList.getThreeConsecutivedNum().reverse()))

/**
 * slotItems型のmutable変数の各プロパティに数値を設定する
 * @param slotItems プロパティをセットしたいSlotItems型の変数
 * @param values 各プロパティに代入したい数値の配列
 */
function SetSlotItems(slotItems: SlotItems, values: number[]): void {
    if(values[0] == null || values[1] == null || values[2] == null) throw new RangeError("配列引数valuesには3つの要素が必要です。")
    slotItems.top = values[0]
    slotItems.middle = values[1]
    slotItems.bottom = values[2]
}

// IntervalIDの宣言
let leftSlotIntervalID: NodeJS.Timer
let middleSlotIntervalID: NodeJS.Timer
let rightSlotIntervalID: NodeJS.Timer
// ストップボタンの表示＆非表示を切り替えるためのフラグ変数
const isStoppedLeftSlot = ref(false)
const isStoppedMiddleSlot = ref(false)
const isStoppedRightSlot = ref(false)

/**
 * 各スロットを回す
 */
function StartTurnSlot() {
    const BASE_WAIT_TIME = 1200
    // 左スロット
    setTimeout(() => {
        leftSlotIntervalID = setInterval(() => {
            leftSlotLinkedList.next()
            SetSlotItems(leftSlotItems, leftSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.leftSpeed)
        isStoppedLeftSlot.value = false
    }, BASE_WAIT_TIME * 1)
    // 中央スロット
    setTimeout(() => {
        middleSlotIntervalID = setInterval(() => {
            middleSlotLinkedList.next()
            SetSlotItems(middleSlotItems, middleSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.middleSpeed)
        isStoppedMiddleSlot.value = false
    }, BASE_WAIT_TIME * 2)
    // 右スロット
    setTimeout(() => {
        rightSlotIntervalID = setInterval(() => {
            rightSlotLinkedList.next()
            SetSlotItems(rightSlotItems, rightSlotLinkedList.getThreeConsecutivedNum().reverse())
        }, slotTurnSpeed.rightSpeed)
        isStoppedRightSlot.value = false
        // 演出のために反映を少し遅らせる
        setTimeout(() => 
            isStartedFinalSlotRoll.value = true
        , 1000)
    }, BASE_WAIT_TIME * 3)
    gamePlayCount.value++
}

// 初回レンダリング時、スロットを回す処理を行う
StartTurnSlot()

// 各ストップボタンが押された時に、対応するスロットの回転を止める処理
const handleStopLeftSlot = () => {
    clearInterval(leftSlotIntervalID)
    isStoppedLeftSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(leftSlotItems.middle)
}
const handleStopMiddleSlot = () => {
    clearInterval(middleSlotIntervalID)
    isStoppedMiddleSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(middleSlotItems.middle)
}
const handleStopRightSlot = () => {
    clearInterval(rightSlotIntervalID)
    isStoppedRightSlot.value = true
    isSlotReachNow.value = gameManager.judgeSlotHorizontalLine(rightSlotItems.middle)
}
// 全てのスロットが止まったことを検知する
const isStoppedAllSlot = computed(() => {
    return isStoppedLeftSlot.value && isStoppedMiddleSlot.value && isStoppedRightSlot.value
})
// ゲーム終了時に実行する処理
watch(isStoppedAllSlot, isStoppedAllSlot => {
    if(isStoppedAllSlot) {
        isOnceCalledReset.value = false
        isGameCleared.value = gameManager.isGameCleared()
    }
})
watch(isGameCleared, (isBig) => {
    if(isBig) bigCount.value++ 
})

/**
 * UI制御用のフラグ変数とゲーム設定を初期化する
*/
const handleResetTurnSlot = () => {
    if(isOnceCalledReset.value) return
    else if(isStoppedAllSlot) {
        isOnceCalledReset.value = true
        isStartedFinalSlotRoll.value = false
        isSlotReachNow.value = false
        isGameCleared.value = false
        gameManager.resetGame()
        // 難易度変更された時のために乱数を再度生成
        slotTurnSpeed.leftSpeed = GenerateRandSlotRollSpeed()
        slotTurnSpeed.middleSpeed = GenerateRandSlotRollSpeed()
        slotTurnSpeed.rightSpeed = GenerateRandSlotRollSpeed()
        StartTurnSlot()
    }
}

// ゲーム難易度に関する設定
type DifficultyNames = keyof typeof RollSpeedByDifficulties
const currentDifficulty = ref<DifficultyNames>("NORMAL")
watch(currentDifficulty, () => BASE_ROLL_SPEED.value = RollSpeedByDifficulties[currentDifficulty.value])

</script>

<template>
    <div class="flex flex-col mx-0 mb-20 my-10">
        <div class="flex justify-center container">
            <div class="text-center">
                <p>PLAY COUNT: {{gamePlayCount}}</p>
                <p>BIG COUNT: {{bigCount}}</p>
            </div>
        </div>
        <div class="flex justify-center my-3 container">
            <select
                class="focus:outline-none focus:ring bg-green-100 px-3 py-1 border-green-200 border-2 rounded-2xl"
                :disabled="!(isStoppedAllSlot && isStartedFinalSlotRoll)"
                v-model="currentDifficulty"
            >
                <option
                    v-for="(_, difficulty) in RollSpeedByDifficulties"
                    class="text-center"    
                >{{difficulty}}</option>
            </select>
        </div>
        <div class="flex flex-wrap justify-center my-2 container">
            <div class="flex flex-col">
                <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
                <button
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg"
                    key="stop-left-slot"
                    v-on:click="handleStopLeftSlot"
                    v-if="isStartedFinalSlotRoll"
                    :disabled="isStoppedLeftSlot && !isStartedFinalSlotRoll"
                >
                    <p>Stop</p>
                </button>
            </div>
            <div class="flex flex-col">
                <SlotVue key="middle-slot" :indexes="middleSlotItems"></SlotVue>
                <button
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg"
                    key="stop-middle-slot"
                    v-on:click="handleStopMiddleSlot"
                    v-if="isStartedFinalSlotRoll"
                    :disabled="isStoppedMiddleSlot && !isStartedFinalSlotRoll"
                >
                    <p>Stop</p>
                </button>
            </div>
            <div class="flex flex-col">
                <SlotVue key="right-slot" :indexes="rightSlotItems"></SlotVue>
                <button
                    class="text-center border-2 mx-2 mt-6 mb-3 rounded-lg"
                    key="stop-right-slot"
                    v-on:click="handleStopRightSlot"
                    v-if="isStartedFinalSlotRoll"
                    :disabled="isStoppedRightSlot && !isStartedFinalSlotRoll"
                >
                    <p>Stop</p>
                </button>
            </div>
        </div>
        <div class="flex flex-col justify-center my-2 container">
            <div class="text-center">
                <p
                    v-if="isGameCleared"
                    class="font-black text-4xl font-serif tracking-widest"
                >BIG!</p>
            </div>
            <div class="text-center">
                <p
                    v-if="isSlotReachNow"
                    class="font-light text-3xl font-serif tracking-wide"
                >reach now!</p>
            </div>
        </div>
        <div class="flex justify-center my-3 container">
            <button
                class="text-center border-4 px-10 py-2 bg-red-400 border-red-100"
                v-on:click="handleResetTurnSlot"
                v-if="isStoppedAllSlot && isStartedFinalSlotRoll"
                :disabled="!(isStoppedAllSlot && isStartedFinalSlotRoll)"
            >
                <p class="text-white">REPLAY</p>
            </button>
        </div>
    </div>
</template>
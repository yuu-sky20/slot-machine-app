<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import GameManager from './utils/SlotMachineGameManager'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import Difficulty from '../../const/baseRollSpeeds'
import { reactive, ref, computed } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

const gameManager = new GameManager()

const gamePlayCount = ref(0)
const isSlotReachNow = ref(false)
const isGameCleared = ref(false)
const isOnceCalledReset = ref(false)
const isStartedFinalSlotRoll = ref(false)

// 3つのスロットの回転速度を一元管理するための型
type SlotTurnSpeed = {
    leftSpeed: number,
    middleSpeed: number,
    rightSpeed: number
}
const ROLL_SPEED = 300
// スロットの回転速度を乱数で生成
function GenerateRandSlotRollSpeed(): number {
    // 難易度変更を実装する際はここの値変えてみる？
    const rand = (Math.floor(Math.random() * 100)) + ROLL_SPEED
    console.log(rand)
    return rand
}
// 初回描画時と初期化時（ゲームリセット時）にのみ実行
function SetSlotTurnSpeed(): SlotTurnSpeed{
    const leftSpeed = GenerateRandSlotRollSpeed()
    const middleSpeed = GenerateRandSlotRollSpeed()
    const rightSpeed = GenerateRandSlotRollSpeed()
    return {
        leftSpeed: leftSpeed,
        middleSpeed: middleSpeed,
        rightSpeed: rightSpeed
    }
}
// 各スロットの回転速度
const slotTurnSpeed: SlotTurnSpeed = reactive(SetSlotTurnSpeed())

// 各スロットアイテムのアイテムを連結リストで管理
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

// 縦スロットの各アイテムを一元管理するための型
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

// 各スロットアイテムの変数の初期化
const initializedLeftSlotValues = leftSlotLinkedList.getThreeConsecutivedNum().reverse()
const initializedMiddleSlotValues = middleSlotLinkedList.getThreeConsecutivedNum().reverse()
const initializedRightSlotValues = rightSlotLinkedList.getThreeConsecutivedNum().reverse()

const leftSlotItems = reactive(InitializeSlotItems(initializedLeftSlotValues))
const middleSlotItems = reactive(InitializeSlotItems(initializedMiddleSlotValues))
const rightSlotItems = reactive(InitializeSlotItems(initializedRightSlotValues))

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
    setTimeout(() => {
        leftSlotIntervalID = setInterval(() => {
            leftSlotLinkedList.next()
            const values = leftSlotLinkedList.getThreeConsecutivedNum().reverse()
            SetSlotItems(leftSlotItems, values)
        }, slotTurnSpeed.leftSpeed)
        isStoppedLeftSlot.value = false
    }, BASE_WAIT_TIME * 1)
    setTimeout(() => {
        middleSlotIntervalID = setInterval(() => {
            middleSlotLinkedList.next()
            const values = middleSlotLinkedList.getThreeConsecutivedNum().reverse()
            SetSlotItems(middleSlotItems, values)
        }, slotTurnSpeed.middleSpeed)
        isStoppedMiddleSlot.value = false
    }, BASE_WAIT_TIME * 2)
    setTimeout(() => {
        rightSlotIntervalID = setInterval(() => {
            rightSlotLinkedList.next()
            const values = rightSlotLinkedList.getThreeConsecutivedNum().reverse()
            SetSlotItems(rightSlotItems, values)
        }, slotTurnSpeed.rightSpeed)
        isStoppedRightSlot.value = false
        // 反映を少し遅らせる
        setTimeout(() => 
            isStartedFinalSlotRoll.value = true
        , 1000)
    }, BASE_WAIT_TIME * 3)
    gamePlayCount.value++
}

StartTurnSlot()

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

const isStoppedAllSlot = computed(() => {
    return isStoppedLeftSlot.value && isStoppedMiddleSlot.value && isStoppedRightSlot.value
})
watch(isStoppedAllSlot, isStoppedAllSlot => {
    if(isStoppedAllSlot) {
        isOnceCalledReset.value = false
        isGameCleared.value = gameManager.isGameCleared()
    }
})
const handleResetTurnSlot = () => {
    if(isOnceCalledReset.value) return
    else if(isStoppedAllSlot) {
        isOnceCalledReset.value = true
        isStartedFinalSlotRoll.value = false
        isSlotReachNow.value = false
        isGameCleared.value = false
        gameManager.resetGame()
        StartTurnSlot()
    }
}


</script>

<template>
    <div class="flex flex-col mx-0">
        <div class="flex justify-center container">
            <div class="text-center">
                <p>PLAY COUNT: {{gamePlayCount}}</p>
            </div>
        </div>
        <div class="flex flex-wrap justify-center my-3 container">
            <div class="flex flex-col">
                <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
                <button
                    class="text-center border-2 mx-2 my-6 rounded-lg"
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
                    class="text-center border-2 mx-2 my-6 rounded-lg"
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
                    class="text-center border-2 mx-2 my-6 rounded-lg"
                    key="stop-right-slot"
                    v-on:click="handleStopRightSlot"
                    v-if="isStartedFinalSlotRoll"
                    :disabled="isStoppedRightSlot && !isStartedFinalSlotRoll"
                >
                    <p>Stop</p>
                </button>
            </div>
        </div>
        <div class="flex justify-center my-3 container">
            <button
                class="text-center border-4 px-10 py-2 bg-red-400 border-red-100"
                v-on:click="handleResetTurnSlot"
                v-if="isStoppedAllSlot && isStartedFinalSlotRoll"
                :disabled="!isStoppedAllSlot && !isStartedFinalSlotRoll"
            >
                <p class="text-white">REPLAY</p>
            </button>
        </div>
        <div class="flex flex-col justify-center my-3 container">
            <div class="text-center">
                <p v-if="isGameCleared">BIG!!!</p>
            </div>
            <div class="text-center">
                <p v-if="isSlotReachNow">REACH NOW!</p>
            </div>
        </div>
        <div class="flex justify-center my-3 container">
            <div class="border-2 border-indigo-100">
                <select
                    class="text-center"
                    v-if="isStoppedAllSlot && isStartedFinalSlotRoll"
                >
                    <option v-for="(_, difficulty) in Difficulty">{{difficulty}}</option>
                </select>
            </div>
        </div>
    </div>
</template>
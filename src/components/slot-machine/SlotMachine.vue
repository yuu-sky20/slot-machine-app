<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import GameManager from './utils/SlotMachineGameManager'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import { reactive, ref, computed } from '@vue/reactivity'

const gameManager = new GameManager()

// 3つのスロットの回転速度を一元管理するための型
type SlotTurnSpeed = {
    leftSpeed: number,
    middleSpeed: number,
    rightSpeed: number
}
// スロットの回転速度を乱数で生成
function GenerateRandSlotRollSpeed(): number {
    // 難易度変更を実装する際はここの値変えてみる？
    const rand = (Math.floor(Math.random() * 100)) + 300
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
    }, BASE_WAIT_TIME * 3)
}

StartTurnSlot()

const handleStopLeftSlot = () => {
    clearInterval(leftSlotIntervalID)
    isStoppedLeftSlot.value = true
}
const handleStopMiddleSlot = () => {
    clearInterval(middleSlotIntervalID)
    isStoppedMiddleSlot.value = true
}
const handleStopRightSlot = () => {
    clearInterval(rightSlotIntervalID)
    isStoppedRightSlot.value = true
}

const isStoppedAllSlot = computed(() => 
    isStoppedLeftSlot.value && isStoppedMiddleSlot.value && isStoppedRightSlot.value
)
const handleResetTurnSlot = () => {
    if(isStoppedAllSlot) StartTurnSlot()
}

</script>

<template>
    <div class="flex flex-col mx-0">
        <div class="flex flex-wrap justify-center my-auto container">
            <div class="flex flex-col">
                <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
                <button
                class="text-center border-2 m-2"
                key="stop-left-slot"
                v-on:click="handleStopLeftSlot"
                :disabled="isStoppedLeftSlot"
                >
                    <p>Stop!</p>
                </button>
            </div>
            <div class="flex flex-col">
                <SlotVue key="middle-slot" :indexes="middleSlotItems"></SlotVue>
                <button
                class="text-center border-2 m-2"
                key="stop-middle-slot"
                v-on:click="handleStopMiddleSlot"
                :disabled="isStoppedMiddleSlot"
                >
                    <p>Stop!</p>
                </button>
            </div>
            <div class="flex flex-col">
                <SlotVue key="right-slot" :indexes="rightSlotItems"></SlotVue>
                <button
                class="text-center border-2 m-2"
                key="stop-right-slot"
                v-on:click="handleStopRightSlot"
                :disabled="isStoppedRightSlot"
                >
                    <p>Stop!</p>
                </button>
            </div>
        </div>
        <div class="flex justify-center my-auto container">
            <button
            class="text-center border-2 m-2"
            v-on:click="handleResetTurnSlot"
            :disabled="!isStoppedAllSlot"
            >
                <p>Reset</p>
            </button>
        </div>
    </div>
</template>
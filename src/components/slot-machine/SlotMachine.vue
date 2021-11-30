<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import { reactive } from '@vue/reactivity'

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

// 縦行のスロットの各アイテムを一元管理するための型
type SlotItems = {
    top: number,
    middle: number,
    bottom: number
}
/**
 * 引数に与えられた3つの数値から、新しいSlotItems型を生成して返す
 * @returns slotItems型を返す
 */
function ConvertItemValuesIntoSlotItems(itemValues: number[]): SlotItems {
    if(itemValues[0] == null || itemValues[1] == null || itemValues[2] == null) throw new RangeError("配列引数itemValuesには3つの要素が必要です。")
    const slotItems: SlotItems = {
        top: itemValues[0],
        middle: itemValues[1],
        bottom: itemValues[2]
    }
    return slotItems
}

// 各スロットアイテムのアイテムを連結リストで管理
const leftSlotLinkedList = new LinkedList()
const middleSlotLinkedList = new LinkedList()
const rightSlotLinkedList = new LinkedList()
let randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => leftSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => middleSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => rightSlotLinkedList.push(index))

// 各スロットアイテムの変数の初期化
const leftSlotInitialValues = leftSlotLinkedList.getThreeConsecutivedNum().reverse()
const leftSlotItems = reactive(ConvertItemValuesIntoSlotItems(leftSlotInitialValues))
const middleSlotInitialValues = middleSlotLinkedList.getThreeConsecutivedNum().reverse()
const middleSlotItems = reactive(ConvertItemValuesIntoSlotItems(middleSlotInitialValues))
const rightSlotInitialValues = rightSlotLinkedList.getThreeConsecutivedNum().reverse()
const rightSlotItems = reactive(ConvertItemValuesIntoSlotItems(rightSlotInitialValues))

// 秒単位で再レンダリングを決定する。
// TODO 今のままだとストップと再起ができないので後でここは関数にして管理する
let leftSlotIntervalID: NodeJS.Timer
let middleSlotIntervalID: NodeJS.Timer
let rightSlotIntervalID: NodeJS.Timer
leftSlotIntervalID = setInterval(() => {
    leftSlotLinkedList.next()
    const values = leftSlotLinkedList.getThreeConsecutivedNum().reverse()
    leftSlotItems.top = values[0]
    leftSlotItems.middle = values[1]
    leftSlotItems.bottom = values[2]
}, slotTurnSpeed.leftSpeed)
setTimeout(() => {
    middleSlotIntervalID = setInterval(() => {
        middleSlotLinkedList.next()
        const values = middleSlotLinkedList.getThreeConsecutivedNum().reverse()
        middleSlotItems.top = values[0]
        middleSlotItems.middle = values[1]
        middleSlotItems.bottom = values[2]
    }, slotTurnSpeed.middleSpeed)
}, 1200)
setTimeout(() => {
    rightSlotIntervalID = setInterval(() => {
        rightSlotLinkedList.next()
        const values = rightSlotLinkedList.getThreeConsecutivedNum().reverse()
        rightSlotItems.top = values[0]
        rightSlotItems.middle = values[1]
        rightSlotItems.bottom = values[2]
    }, slotTurnSpeed.rightSpeed)
}, 2400)

const handleStopLeftSlot = () => {
    clearInterval(leftSlotIntervalID)
}
const handleStopMiddleSlot = () => {
    clearInterval(middleSlotIntervalID)
}
const handleStopRightSlot = () => {
    clearInterval(rightSlotIntervalID)
}

</script>

<template>
    <div>
        <div class="flex flex-wrap justify-center mx-0 my-auto container">
            <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
            <SlotVue key="middle-slot" :indexes="middleSlotItems"></SlotVue>
            <SlotVue key="right-slot" :indexes="rightSlotItems"></SlotVue>
        </div>
        <div>
            <button key="stop-left-slot" v-on:click="handleStopLeftSlot">Stop!</button>
            <button key="stop-middle-slot" v-on:click="handleStopMiddleSlot">Stop!</button>
            <button key="stop-right-slot" v-on:click="handleStopRightSlot">Stop!</button>
        </div>
    </div>
</template>
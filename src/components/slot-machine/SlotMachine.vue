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
const leftSlotInitialValues = leftSlotLinkedList.getThreeConsecutivedNum()
const leftSlotItems = reactive({
    top: leftSlotInitialValues[2],
    middle: leftSlotInitialValues[1],
    bottom: leftSlotInitialValues[0]
})
const middleSlotInitialValues = middleSlotLinkedList.getThreeConsecutivedNum()
const middleSlotItems = reactive({
    top: middleSlotInitialValues[2],
    middle: middleSlotInitialValues[1],
    bottom: middleSlotInitialValues[0]
})
const rightSlotInitialValues = rightSlotLinkedList.getThreeConsecutivedNum()
const rightSlotItems = reactive({
    top: rightSlotInitialValues[2],
    middle: rightSlotInitialValues[1],
    bottom: rightSlotInitialValues[0]
})

// 秒単位で再レンダリングを決定する。
// TODO 今のままだとストップと再起ができないので後でここは関数にして管理する
setInterval(() => {
    leftSlotLinkedList.next()
    const values = leftSlotLinkedList.getThreeConsecutivedNum()
    leftSlotItems.top = values[2]
    leftSlotItems.middle = values[1]
    leftSlotItems.bottom = values[0]
}, slotTurnSpeed.leftSpeed)
setTimeout(() => {
    setInterval(() => {
        middleSlotLinkedList.next()
        const values = middleSlotLinkedList.getThreeConsecutivedNum()
        middleSlotItems.top = values[2]
        middleSlotItems.middle = values[1]
        middleSlotItems.bottom = values[0]
    }, slotTurnSpeed.middleSpeed)
}, 1200)
setTimeout(() => {
    setInterval(() => {
        rightSlotLinkedList.next()
        const values = rightSlotLinkedList.getThreeConsecutivedNum()
        rightSlotItems.top = values[2]
        rightSlotItems.middle = values[1]
        rightSlotItems.bottom = values[0]
    }, slotTurnSpeed.rightSpeed)
}, 2400)

</script>

<template>
    <div class="flex flex-wrap justify-center mx-0 my-auto container">
        <SlotVue key="left-slot" :indexes="leftSlotItems"></SlotVue>
        <SlotVue key="middle-slot" :indexes="middleSlotItems"></SlotVue>
        <SlotVue key="right-slot" :indexes="rightSlotItems"></SlotVue>
    </div>
</template>
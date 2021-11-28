<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import LinkedList from './utils/LinkedList'
import emojiItems from '../../const/emojiItems'
import { reactive } from '@vue/reactivity'

type SlotTurnSpeed = {
    leftSpeed: number,
    middleSpeed: number,
    rightSpeed: number
}
function GenerateRandSpeed(): number {
    // 難易度変更の際はここの値変えてみる？
    const rand = (Math.floor(Math.random() * 100)) + 300
    console.log(rand)
    return rand
}
// 初回描画時と初期化時（ゲームリセット時）にのみ実行
function SetSlotTurnSpeed(): SlotTurnSpeed{
    const leftSpeed = GenerateRandSpeed()
    const middleSpeed = GenerateRandSpeed()
    const rightSpeed = GenerateRandSpeed()
    return {
        leftSpeed: leftSpeed,
        middleSpeed: middleSpeed,
        rightSpeed: rightSpeed
    }
}
const slotTurnSpeed: SlotTurnSpeed = reactive(SetSlotTurnSpeed())

const leftSlotLinkedList = new LinkedList()
const middleSlotLinkedList = new LinkedList()
const rightSlotLinkedList = new LinkedList()
let randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => leftSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => middleSlotLinkedList.push(index))
randIndexes = GenerateRandIndexes(emojiItems.length)
randIndexes.forEach(index => rightSlotLinkedList.push(index))

const leftSlotInitialValues = leftSlotLinkedList.getThreeConsecutivedNum()
const leftSlotValues = reactive({
    top: leftSlotInitialValues[2],
    middle: leftSlotInitialValues[1],
    bottom: leftSlotInitialValues[0]
})
const middleSlotInitialValues = middleSlotLinkedList.getThreeConsecutivedNum()
const middleSlotValues = reactive({
    top: middleSlotInitialValues[2],
    middle: middleSlotInitialValues[1],
    bottom: middleSlotInitialValues[0]
})
const rightSlotInitialValues = rightSlotLinkedList.getThreeConsecutivedNum()
const rightSlotValues = reactive({
    top: rightSlotInitialValues[2],
    middle: rightSlotInitialValues[1],
    bottom: rightSlotInitialValues[0]
})

setInterval(() => {
    leftSlotLinkedList.next()
    const values = leftSlotLinkedList.getThreeConsecutivedNum()
    leftSlotValues.top = values[2]
    leftSlotValues.middle = values[1]
    leftSlotValues.bottom = values[0]
}, slotTurnSpeed.leftSpeed)
setTimeout(() => {
    setInterval(() => {
        middleSlotLinkedList.next()
        const values = middleSlotLinkedList.getThreeConsecutivedNum()
        middleSlotValues.top = values[2]
        middleSlotValues.middle = values[1]
        middleSlotValues.bottom = values[0]
    }, slotTurnSpeed.middleSpeed)
}, 1200)
setTimeout(() => {
    setInterval(() => {
        rightSlotLinkedList.next()
        const values = rightSlotLinkedList.getThreeConsecutivedNum()
        rightSlotValues.top = values[2]
        rightSlotValues.middle = values[1]
        rightSlotValues.bottom = values[0]
    }, slotTurnSpeed.rightSpeed)
}, 2400)

</script>

<template>
    <div class="flex flex-wrap justify-center mx-0 my-auto container">
        <SlotVue key="left-slot" :indexes="leftSlotValues"></SlotVue>
        <SlotVue key="middle-slot" :indexes="middleSlotValues"></SlotVue>
        <SlotVue key="right-slot" :indexes="rightSlotValues"></SlotVue>
    </div>
</template>
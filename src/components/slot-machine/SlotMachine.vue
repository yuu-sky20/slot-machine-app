<script setup lang="ts">
import SlotVue from './Slot.vue'
import GenerateRandIndexes from './utils/GenerateRandIndexes'
import { reactive } from '@vue/reactivity'

// 3つのUIのスロットを回す関数はSetTimeOutでバラして起動する
// スロット止める == speedに0を代入する(非同期うまく組み合わさる？)

// もう一度遊ぶボタンを描画する


// reactiveはturnSpeedsに使う
/**
 * turnSpeeds: Object, reactive
 * {
 *  leftSlotSpeed: number,
 *  middleSlotSpeed: number,
 *  rightSlotSpeed: number,
 * }
 */

</script>

<template>
    <div class="flex flex-wrap justify-center mx-0 my-auto container">
        <SlotVue key="left-slot"></SlotVue>
        <SlotVue key="middle-slot"></SlotVue>
        <SlotVue key="right-slot"></SlotVue>
    </div>
</template>
<script setup lang="ts">
import SlotVue from './Slot.vue'
import { reactive } from '@vue/reactivity';

// 3つのUIのスロットを回す関数はSetTimeOutでバラして起動する
// speedをそれぞれ別にする？
// スロット止める == speedに0を代入する(非同期うまく組み合わさる？)


// もう一度遊ぶボタンを描画する
// 初期化をする



</script>

<template>
    <div class="flex flex-wrap justify-center mx-0 my-auto container">
        <SlotVue key="left-slot"></SlotVue>
        <SlotVue key="middle-slot"></SlotVue>
        <SlotVue key="right-slot"></SlotVue>
    </div>
</template>
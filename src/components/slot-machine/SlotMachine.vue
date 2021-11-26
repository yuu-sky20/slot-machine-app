<script setup lang="ts">
// 3つのUIのスロットを回す関数はSetTimeOutでバラして起動する
// speedをそれぞれ別にする？
// スロット止める == speedに0を代入する(非同期うまく組み合わさる？)

// ここと同じディレクトリ階層にSlotGameManager.ts置いてゲームクリア判定とかは別にした方がいいかも？
// ローカルスコープ内、一時変数にアイテムを保存する (for)
// グローバル変数に&&でbool値を入れる (mutable reactive?)
// 3つのスロットが止まったことを検知する -> 全て非同期で起動すれば感知できるのでそれでいける
// ゲーム結果を返す

// もう一度遊ぶボタンを描画する
// 初期化をする

import SlotVue from './Slot.vue'
</script>

<template>
    <div class="flex flex-wrap justify-center mx-0 my-auto container">
        <SlotVue key="left"></SlotVue>
        <SlotVue key="middle"></SlotVue>
        <SlotVue key="right"></SlotVue>
    </div>
</template>
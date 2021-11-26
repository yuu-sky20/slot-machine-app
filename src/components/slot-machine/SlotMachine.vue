<script setup lang="ts">
// 3つのUIのスロットを回す関数はSetTimeOutでバラして起動する

// scriptには、これらが必要

// スロットを起動
// スロット止める
// ローカルスコープ内、一時変数にアイテムを保存する
// グローバル変数に&&でbool値を入れる
// 3つのスロットが止まったことを検知する -> 全て非同期で起動すれば感知できるのでそれでいける
// 結果を表示する
// もう一度遊ぶボタンを描画する
// 初期化をする

import SlotVue from './Slot.vue'
// オイオイオイ idか何かつけないとDOMが識別できねーぞこれｗｗ
</script>

<template>
    <div class="flex flex-wrap container">
        <SlotVue key="left"></SlotVue>
        <SlotVue key="middle"></SlotVue>
        <SlotVue key="right"></SlotVue>
    </div>
</template>
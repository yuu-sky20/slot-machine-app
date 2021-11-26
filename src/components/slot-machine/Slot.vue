<script setup lang="ts">
import ItemVue from './Item.vue';
// コンポーネントのTopが画面一番下と当たり判定が被ったとき、一番上のBottomのpositionにテレポートさせる
// 1個ずつ一番上から一番下へ流す
// それを3つ用意する 等間隔で
// Transition
// 当たり判定制御、アニメーション、の2つと、新しいアイテム代入する操作が必要

</script>

<template>
    <div class="flex flex-col">
        <ItemVue key="a"></ItemVue>
        <ItemVue key="b"></ItemVue>
        <ItemVue key="c"></ItemVue>
    </div>
</template>
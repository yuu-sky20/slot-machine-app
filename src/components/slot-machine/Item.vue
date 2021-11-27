<script setup lang="ts">
// 最終的には親からslotで渡される形にする
// 乱数はSlotMachineで制御する(Slot3つで同じ値を扱いため)
import emojiItems from '../../const/emojiItems' // ここのインポートはそのまま
const randIndex = Math.floor(Math.random() * emojiItems.length) // ここを消してtemplateにv-slot入れる
</script>

<template>
    <div class="px-2">
        <div class="box-border text-center">
            <p class="text-5xl">{{emojiItems[randIndex]}}</p>
        </div>
    </div>
</template>
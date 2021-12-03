<script setup lang="ts">
import emojiItems from '../../const/emojiItems'
interface Props {
    index: number
}
const props = defineProps<Props>()
</script>

<template>
    <div class="px-2">
        <div class="box-border text-center">
            <p class="text-5xl select-none">{{emojiItems[index]}}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import ItemVue from './Item.vue'
interface Props {
    indexes: {
        top: number,
        middle: number,
        bottom: number
    }
}
const props = defineProps<Props>()
</script>

<template>
    <div class="flex flex-col mx-3 justify-center">
        <ItemVue key="top" :index="indexes.top"></ItemVue>
        <ItemVue key="middle" :index="indexes.middle"></ItemVue>
        <ItemVue key="bottom" :index="indexes.bottom"></ItemVue>
    </div>
</template>
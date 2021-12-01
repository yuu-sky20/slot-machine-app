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
    <div class="flex flex-col justify-center">
        <ItemVue key="top" :index="indexes.top" class="my-2 bg-gray-100"></ItemVue>
        <ItemVue key="middle" :index="indexes.middle" class="my-2 px-5 bg-yellow-100"></ItemVue>
        <ItemVue key="bottom" :index="indexes.bottom" class="my-2 bg-gray-100"></ItemVue>
    </div>
</template>
<script setup lang="ts">
import GoneSlotItemVue from './slot-items/GoneSlotItem.vue';
import NowSlotItemVue from './slot-items/NowSlotItem.vue';
import WillSlotItemVue from './slot-items/WillSlotItem.vue';

</script>

<template>
    <div class="flex">
        <div class="flex-col">
            <GoneSlotItemVue></GoneSlotItemVue>
            <NowSlotItemVue></NowSlotItemVue>
            <WillSlotItemVue></WillSlotItemVue>
        </div>
    </div>
</template>
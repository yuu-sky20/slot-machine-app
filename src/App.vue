<script setup lang="ts">
import HeaderVue from './components/generals/Header.vue';
import FooterVue from './components/generals/Footer.vue';
import SlotMachineVue from './components/slot-machine/SlotMachine.vue';
</script>

<template>
    <div class="flex flex-col">
        <Header>
            <HeaderVue></HeaderVue>
        </Header>
        <main>
            <SlotMachineVue></SlotMachineVue>
        </main>
        <Footer>
            <FooterVue></FooterVue>
        </Footer>
    </div>
</template>

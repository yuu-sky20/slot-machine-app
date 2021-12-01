<script setup lang="ts">
import HeaderVue from './components/generals/Header.vue'
import FooterVue from './components/generals/Footer.vue'
import SlotMachineVue from './components/slot-machine/SlotMachine.vue'
</script>

<template>
    <div>
        <header>
            <HeaderVue></HeaderVue>
        </header>
        <main>
            <SlotMachineVue></SlotMachineVue>
        </main>
        <footer>
            <FooterVue></FooterVue>
        </footer>
    </div>
</template>

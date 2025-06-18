<template>
  <div class="p-4 text-white bg-black min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Poker Tools</h1>
    <div class="tabs space-x-4">
      <button @click="tab = 'range'" :class="btnClass('range')">Calculateur de Range</button>
      <button @click="tab = 'equity'" :class="btnClass('equity')">Chances de Gagner</button>
      <button @click="tab = 'odds'" :class="btnClass('odds')">Cote du Pot</button>
    </div>

    <div class="mt-6">
      <RangeCalculator v-if="tab === 'range'" />
      <EquityCalculator v-if="tab === 'equity'" />
      <PotOddsCalculator v-if="tab === 'odds'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RangeCalculator from './components/RangeCalculator.vue'
import EquityCalculator from './components/EquityCalculator.vue'
import PotOddsCalculator from './components/PotOddsCalculator.vue'

const tab = ref('range')

function btnClass(name: string) {
  return tab.value === name ? 'font-bold underline' : ''
}
</script>

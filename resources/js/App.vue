<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Poker Tools</h1>

    <!-- Onglets -->
    <div class="flex justify-center gap-4 mb-8">
      <button
        v-for="name in tabs"
        :key="name.value"
        @click="tab = name.value"
        :class="[
          'px-4 py-2 rounded-lg transition-all duration-200',
          tab === name.value
            ? 'bg-blue-600 text-white shadow'
            : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
        ]"
      >
        {{ name.label }}
      </button>
    </div>

    <!-- Contenu -->
    <div class="bg-white rounded-xl shadow p-6 mx-auto">
      <RangeCalculator v-if="tab === 'range'" />
      <EquityCalculator v-if="tab === 'equity'" />
      <PotOddsCalculator v-if="tab === 'odds'" />
      <LexiquePoker v-if="tab === 'lexique'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RangeCalculator from './components/RangeCalculator.vue'
import EquityCalculator from './components/EquityCalculator.vue'
import PotOddsCalculator from './components/PotOddsCalculator.vue'
import LexiquePoker from './components/LexiquePoker.vue'
import { ref, watch } from 'vue'


const tab = ref(localStorage.getItem('activeTab') || 'range')

watch(tab, (nouvelOnglet) => {
  localStorage.setItem('activeTab', nouvelOnglet)
})


const tabs = [
  { label: 'Calculateur de Range', value: 'range' },
  { label: 'Chances de Gagner', value: 'equity' },
  { label: 'Cote du Pot', value: 'odds' },
  { label: 'Lexique Poker', value: 'lexique' }
]
</script>
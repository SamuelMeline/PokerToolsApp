<template>
  <div class="p-4 border rounded max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Cote du Pot</h2>

    <label class="block mb-1">Mise à rajouter :</label>
    <input type="number" v-model.number="bet" class="w-full mb-4 border p-2 rounded" />

    <label class="block mb-1">Pot total (après ton call) :</label>
    <input type="number" v-model.number="pot" class="w-full mb-4 border p-2 rounded" />

    <button @click="calculate" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Calculer
    </button>

    <div v-if="odds !== null" class="mt-4">
      <p><strong>Cote :</strong> {{ odds.toFixed(1) }}%</p>
      <p><strong>Ratio :</strong> 1 : {{ ratio }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bet = ref(0)
const pot = ref(0)
const odds = ref<number | null>(null)
const ratio = ref<number | null>(null)

function calculate() {
  if (bet.value > 0 && pot.value > 0) {
    odds.value = (bet.value / pot.value) * 100
    ratio.value = Math.round(pot.value / bet.value)
  } else {
    odds.value = null
    ratio.value = null
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-2">Chances de Gagner</h2>

    <label>Votre main :</label>
    <input v-model="hand" placeholder="ex: AhKh" />

    <label>Board (optionnel) :</label>
    <input v-model="board" placeholder="ex: QsJhTc" />

    <button @click="calculate">Calculer</button>

    <div v-if="equity">
      <p>Nombre d'outs : {{ equity.outs }}</p>
      <p>Probabilité de gagner : {{ equity.percent }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hand = ref('')
const board = ref('')
const equity = ref(null)

function calculate() {
  // Exemple simple
  const outs = Math.floor(Math.random() * 10) + 1
  const percent = (outs * 2).toFixed(2)
  equity.value = { outs, percent }
}
</script>

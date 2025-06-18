<template>
  <div>
    <h2 class="text-xl font-bold mb-2">Cote du Pot</h2>
    
    <label>Mise :</label>
    <input type="number" v-model.number="bet" />

    <label>Pot :</label>
    <input type="number" v-model.number="pot" />

    <button @click="calculate">Calculer</button>

    <div v-if="odds !== null">
      <p>Cote : {{ odds }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bet = ref(0)
const pot = ref(0)
const odds = ref(null)

function calculate() {
  if (bet.value > 0 && pot.value >= 0) {
    const totalPot = pot.value + bet.value + bet.value // pot + mise adverse + ton call
    odds.value = ((bet.value / totalPot) * 100).toFixed(2)
  }
}

</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calculateur d'Outs</h2>

    <label class="block mb-2">Votre main :</label>
    <input v-model="hand" placeholder="ex: AhKh" class="mb-4 p-2 border" />

    <label class="block mb-2">Board :</label>
    <input v-model="board" placeholder="ex: QcTh6h" class="mb-4 p-2 border" />

    <button @click="calculateEquity" class="px-4 py-2 bg-blue-500 text-white rounded">
      Calculer
    </button>

    <div v-if="equity" class="mt-4">
      <p class="text-lg">Outs estimés : <strong>{{ equity.outs }}</strong></p>
      <p class="text-lg">Probabilité de gagner (~2 cartes à venir) : <strong>{{ equity.percent }}%</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hand = ref('')
const board = ref('')
const equity = ref<{ outs: number; percent: number } | null>(null)

const allRanks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const allSuits = ['h', 'd', 'c', 's']

const rankToValue = (r: string): number => {
  if (r === 'T') return 10
  if (r === 'J') return 11
  if (r === 'Q') return 12
  if (r === 'K') return 13
  if (r === 'A') return 14
  return parseInt(r)
}

function calculateEquity() {
  const input = (hand.value + board.value).match(/.{1,2}/g) || []
  if (input.length < 5) {
    equity.value = null
    return
  }

  const used = new Set(input)

  // Count suits
  const suits = input.map(c => c[1])
  const flushSuit = allSuits.find(suit => suits.filter(s => s === suit).length >= 4)

  // Flush outs
const flushOuts: Set<string> = new Set()
  if (flushSuit) {
    for (const rank of allRanks) {
      const card = rank + flushSuit
      if (!used.has(card)) flushOuts.add(card)
    }
  }

  // Straight draw check
  const values = input.map(c => rankToValue(c[0]))
  const uniqueVals = Array.from(new Set(values)).sort((a, b) => a - b)

  const neededStraights = []
  for (let i = 0; i <= 10; i++) {
    const sequence = [i + 1, i + 2, i + 3, i + 4]
    if (sequence.every(v => uniqueVals.includes(v))) {
      neededStraights.push(i + 5)
    }
  }

  const straightOuts = new Set<string>()
  for (const val of neededStraights) {
    const rank = allRanks.find(r => rankToValue(r) === val)
    if (!rank) continue
    for (const suit of allSuits) {
      const card = rank + suit
      if (!used.has(card)) straightOuts.add(card)
    }
  }

  // Exclude flush outs already counted
  for (const card of flushOuts) {
    straightOuts.delete(card)
  }

  const totalOuts = flushOuts.size + straightOuts.size
  const percent = parseFloat((totalOuts * 4).toFixed(2)) // approximation pour turn + river

  equity.value = {
    outs: totalOuts,
    percent
  }
}
</script>

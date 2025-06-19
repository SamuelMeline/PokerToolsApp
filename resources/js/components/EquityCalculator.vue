<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calculateur d'Outs</h2>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="font-semibold mb-1">Votre main :</p>
        <CardSelector v-model="hand[0]" :excluded-cards="usedCards" />
        <CardSelector v-model="hand[1]" :excluded-cards="usedCards" />
      </div>
      <div>
        <p class="font-semibold mb-1">Board :</p>
        <CardSelector v-model="board[0]" :excluded-cards="usedCards" />
        <CardSelector v-model="board[1]" :excluded-cards="usedCards" />
        <CardSelector v-model="board[2]" :excluded-cards="usedCards" />
      </div>
    </div>

    <button @click="calculateEquity" class="px-4 py-2 bg-blue-600 text-white rounded">Calculer</button>

    <div v-if="equity" class="mt-4">
      <p class="text-lg">Outs estimés : <strong>{{ equity.outs }}</strong></p>
      <p class="text-lg">Probabilité approximative : <strong>{{ equity.percent }}%</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CardSelector from './CardSelector.vue'

const hand = ref(['', ''])
const board = ref(['', '', ''])
const equity = ref<{ outs: number; percent: number } | null>(null)

const usedCards = computed(() => [...hand.value, ...board.value].filter(Boolean))

// ------------------------------
// OUTS CALCULATOR LOGIC
// ------------------------------
const ranks = '23456789TJQKA'
const suits = 'hdsc'

function parseCard(card: string) {
  return { rank: card[0], suit: card[1] }
}

function generateDeck(): string[] {
  const deck = []
  for (const r of ranks) {
    for (const s of suits) {
      const card = `${r}${s}`
      if (!usedCards.value.includes(card)) {
        deck.push(card)
      }
    }
  }
  return deck
}

function calculateEquity() {
  const allCards = [...hand.value, ...board.value].filter(Boolean)
  if (allCards.length < 5) {
    equity.value = null
    return
  }

  const deck = generateDeck()
  const currentCards = allCards.map(parseCard)

  const flushOuts = computeFlushOuts(currentCards, deck)
  const straightOuts = computeStraightOuts(currentCards, deck)

  // Fusionner les outs sans doublons
  const totalOuts = new Set([...flushOuts, ...straightOuts])
  const outs = totalOuts.size

  const percent = +(outs * 4).toFixed(2) // approximation : règle du 4 au flop
  equity.value = { outs, percent }
}

function computeFlushOuts(cards: { rank: string; suit: string }[], deck: string[]) {
  const suitsCount: Record<string, string[]> = { h: [], d: [], s: [], c: [] }
  for (const card of cards) {
    suitsCount[card.suit].push(card.rank)
  }

  const flushSuit = Object.entries(suitsCount).find(([, ranks]) => ranks.length >= 4)?.[0]
  if (!flushSuit) return new Set<string>()

  return new Set(deck.filter(c => c[1] === flushSuit))
}

function computeStraightOuts(cards: { rank: string; suit: string }[], deck: string[]) {
  const rankToValue: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9,
    'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  }

  const cardValues = [...new Set(cards.map(c => rankToValue[c.rank]))].sort((a, b) => a - b)

  const sequences = [
    [2, 3, 4, 5], [3, 4, 5, 6], [4, 5, 6, 7], [5, 6, 7, 8],
    [6, 7, 8, 9], [7, 8, 9, 10], [8, 9, 10, 11],
    [9, 10, 11, 12], [10, 11, 12, 13], [11, 12, 13, 14],
    [2, 3, 4, 5, 14] // low Ace straight (A2345)
  ]

  const straightOuts = new Set<string>()

  for (const seq of sequences) {
    const hits = seq.filter(v => cardValues.includes(v))
    if (hits.length === 4) {
      const missing = seq.find(v => !cardValues.includes(v))
      if (missing) {
        const rankChar = Object.entries(rankToValue).find(([, v]) => v === missing)?.[0]
        if (rankChar) {
          for (const suit of suits) {
            const candidate = `${rankChar}${suit}`
            if (!usedCards.value.includes(candidate)) {
              straightOuts.add(candidate)
            }
          }
        }
      }
    }
  }

  return straightOuts
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calculateur d'Outs</h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
      <div v-for="card in allCards" :key="card.code" class="border rounded p-1 text-center cursor-pointer"
           :class="{
             'bg-blue-200': selectedCardCodes.includes(card.code),
             'bg-green-100': hand.some(c => c.code === card.code),
             'bg-yellow-100': flop.some(c => c.code === card.code),
             'bg-orange-100': turn?.code === card.code,
             'bg-red-100': river?.code === card.code
           }"
           @click="toggleCard(card)">
        {{ card.label }}
      </div>
    </div>

    <div class="mb-4">
      <p><strong>Hand:</strong> {{ hand.map(c => c.label).join(', ') }}</p>
      <p><strong>Flop:</strong> {{ flop.map(c => c.label).join(', ') }}</p>
      <p><strong>Turn:</strong> {{ turn?.label || '-' }}</p>
      <p><strong>River:</strong> {{ river?.label || '-' }}</p>
    </div>

    <div v-if="result">
      <p><strong>Outs:</strong> {{ result.outs }}</p>
      <p><strong>Chance d'amélioration:</strong> {{ result.percentage }}%</p>
      <p><strong>Tirages détectés:</strong> {{ result.draws.join(', ') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { computeOuts, Card } from '../../utils/pokerUtils'

const suits = ['♥', '♦', '♣', '♠']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const allCards: Card[] = ranks.flatMap(rank =>
  suits.map(suit => ({
    code: rank + suit,
    rank,
    suit,
    label: rank + suit
  }))
)

export default defineComponent({
  setup() {
    const selectedCardCodes = ref<string[]>([])

    const hand = computed(() =>
      selectedCardCodes.value.slice(0, 2).map(code => allCards.find(c => c.code === code)!)
    )
    const flop = computed(() =>
      selectedCardCodes.value.slice(2, 5).map(code => allCards.find(c => c.code === code)!).filter(Boolean)
    )
    const turn = computed(() =>
      allCards.find(c => c.code === selectedCardCodes.value[5]) || null
    )
    const river = computed(() =>
      allCards.find(c => c.code === selectedCardCodes.value[6]) || null
    )

    const toggleCard = (card: Card) => {
      if (selectedCardCodes.value.includes(card.code)) {
        selectedCardCodes.value = selectedCardCodes.value.filter(c => c !== card.code)
      } else if (selectedCardCodes.value.length < 7) {
        selectedCardCodes.value.push(card.code)
      }
    }

    const result = computed(() => {
      if (hand.value.length === 2 && flop.value.length === 3) {
        return computeOuts(hand.value, flop.value, turn.value || undefined, river.value || undefined)
      }
      return null
    })

    return {
      allCards,
      selectedCardCodes,
      toggleCard,
      hand,
      flop,
      turn,
      river,
      result
    }
  }
})
</script>

<style scoped>
.grid div {
  min-width: 36px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
}
</style>

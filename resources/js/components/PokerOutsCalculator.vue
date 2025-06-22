<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Calculateur d'Outs</h2>

    <!-- Sélection de la main -->
    <div class="mb-2">
      <h3 class="font-semibold mb-1">Main (2 cartes)</h3>
      <div class="grid grid-cols-8 gap-1 mb-2">
        <div
          v-for="card in allCards"
          :key="'hand-' + card.code"
          class="border rounded text-center p-1 cursor-pointer font-semibold"
          :class="[
            selectedCardCodes.includes(card.code) ? 'bg-green-200' : '',
            card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'
          ]"
          @click="selectCard(card, 'hand')"
        >
          {{ card.label }}
        </div>
      </div>
    </div>

    <!-- Sélection du flop -->
    <div class="mb-2">
      <h3 class="font-semibold mb-1">Flop (3 cartes)</h3>
      <div class="grid grid-cols-8 gap-1 mb-2">
        <div
          v-for="card in allCards"
          :key="'flop-' + card.code"
          class="border rounded text-center p-1 cursor-pointer font-semibold"
          :class="[
            selectedCardCodes.includes(card.code) ? 'bg-yellow-200' : '',
            card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'
          ]"
          @click="selectCard(card, 'flop')"
        >
          {{ card.label }}
        </div>
      </div>
    </div>

    <!-- Turn -->
    <div class="mb-2">
      <h3 class="font-semibold mb-1">Turn (1 carte)</h3>
      <div class="grid grid-cols-8 gap-1 mb-2">
        <div
          v-for="card in allCards"
          :key="'turn-' + card.code"
          class="border rounded text-center p-1 cursor-pointer font-semibold"
          :class="[
            selectedCardCodes.includes(card.code) ? 'bg-orange-200' : '',
            card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'
          ]"
          @click="selectCard(card, 'turn')"
        >
          {{ card.label }}
        </div>
      </div>
    </div>

    <!-- River -->
    <div class="mb-4">
      <h3 class="font-semibold mb-1">River (1 carte)</h3>
      <div class="grid grid-cols-8 gap-1">
        <div
          v-for="card in allCards"
          :key="'river-' + card.code"
          class="border rounded text-center p-1 cursor-pointer font-semibold"
          :class="[
            selectedCardCodes.includes(card.code) ? 'bg-red-200' : '',
            card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'
          ]"
          @click="selectCard(card, 'river')"
        >
          {{ card.label }}
        </div>
      </div>
    </div>

    <!-- Résumé -->
    <div class="mb-4">
      <p><strong>Hand:</strong> {{ hand.map(c => c.label).join(', ') }}</p>
      <p><strong>Flop:</strong> {{ flop.map(c => c.label).join(', ') }}</p>
      <p><strong>Turn:</strong> {{ turn?.label || '-' }}</p>
      <p><strong>River:</strong> {{ river?.label || '-' }}</p>
    </div>

    <!-- Résultat -->
    <div v-if="result" class="bg-gray-100 p-4 rounded-lg shadow-inner">
      <p><strong>Outs:</strong> {{ result.outs }}</p>
      <p><strong>Chance d'amélioration:</strong> {{ result.percentage }}%</p>
      <p><strong>Tirages détectés:</strong> {{ result.draws.length ? result.draws.join(', ') : 'Aucun' }}</p>
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
    const hand = ref<Card[]>([])
    const flop = ref<Card[]>([])
    const turn = ref<Card | null>(null)
    const river = ref<Card | null>(null)
    const selectedCardCodes = ref<string[]>([])

    const selectCard = (card: Card, zone: 'hand' | 'flop' | 'turn' | 'river') => {
      const alreadySelected = selectedCardCodes.value.includes(card.code)
      if (alreadySelected) {
        // Supprimer de toutes les zones
        selectedCardCodes.value = selectedCardCodes.value.filter(c => c !== card.code)
        hand.value = hand.value.filter(c => c.code !== card.code)
        flop.value = flop.value.filter(c => c.code !== card.code)
        if (turn.value?.code === card.code) turn.value = null
        if (river.value?.code === card.code) river.value = null
        return
      }

      // Empêcher dépassement et doublons
      if (selectedCardCodes.value.includes(card.code)) return
      if (zone === 'hand' && hand.value.length < 2) {
        hand.value.push(card)
      } else if (zone === 'flop' && flop.value.length < 3) {
        flop.value.push(card)
      } else if (zone === 'turn' && !turn.value) {
        turn.value = card
      } else if (zone === 'river' && !river.value) {
        river.value = card
      } else {
        return
      }

      selectedCardCodes.value.push(card.code)
    }

    const result = computed(() => {
      if (hand.value.length === 2 && flop.value.length === 3) {
        return computeOuts(hand.value, flop.value, turn.value || undefined, river.value || undefined)
      }
      return null
    })

    return {
      allCards,
      hand,
      flop,
      turn,
      river,
      selectCard,
      selectedCardCodes,
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
}
</style>

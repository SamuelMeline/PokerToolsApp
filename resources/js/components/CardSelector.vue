<!-- src/components/CardSelector.vue -->
<template>
  <select v-model="model" class="p-2 rounded text-black">
    <option disabled value="">-- Choisir une carte --</option>
    <option
      v-for="card in filteredCards"
      :key="card"
      :value="card"
    >
      {{ card }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  excludedCards?: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Génère le deck complet
const suits = ['h', 'd', 'c', 's']
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const fullDeck = ranks.flatMap(rank => suits.map(suit => rank + suit))

const filteredCards = computed(() =>
  fullDeck.filter(card => !props.excludedCards?.includes(card))
)
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-xl p-4 w-[340px]">
      <h3 class="text-lg font-bold mb-4 text-center">Sélectionnez une carte</h3>
      <div class="grid grid-cols-13 gap-1 justify-center text-sm">
        <button
          v-for="card in cards"
          :key="card"
          :disabled="excludedCards.includes(card)"
          :class="[
            'p-1 border rounded hover:bg-blue-200',
            selectedCards.includes(card) ? 'bg-blue-500 text-white' : '',
            excludedCards.includes(card) ? 'opacity-30 cursor-not-allowed' : ''
          ]"
          @click="toggleCard(card)"
        >
          {{ card }}
        </button>
      </div>

      <div class="mt-4 flex justify-between">
        <button @click="close" class="bg-gray-300 px-4 py-1 rounded">Annuler</button>
        <button
          @click="validate"
          class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          :disabled="selectedCards.length !== maxSelect"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  excludedCards: string[]
  maxSelect: number
}>()

const emit = defineEmits(['close', 'selected'])

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const suits = ['h', 'd', 'c', 's'] // coeur, carreau, trèfle, pique
const cards = ranks.flatMap(r => suits.map(s => r + s))

const selectedCards = ref<string[]>([])

function toggleCard(card: string) {
  if (selectedCards.value.includes(card)) {
    selectedCards.value = selectedCards.value.filter(c => c !== card)
  } else if (selectedCards.value.length < props.maxSelect) {
    selectedCards.value.push(card)
  }
}

function validate() {
  emit('selected', selectedCards.value)
  close()
}

function close() {
  selectedCards.value = []
  emit('close')
}

watch(() => props.visible, (newVal) => {
  if (!newVal) selectedCards.value = []
})
</script>

<style scoped>
.grid-cols-13 {
  grid-template-columns: repeat(13, minmax(0, 1fr));
}
</style>

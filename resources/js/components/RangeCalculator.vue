<template>
  <div class="mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">Visualiseur de Range</h2>

    <div class="flex flex-col md:flex-row gap-8 items-start">
      <!-- Sélections -->
      <div class="w-full md:w-1/3 space-y-6">
        <div>
          <label class="block font-semibold mb-2">Stack size (BB)</label>
          <select v-model="selectedStack" class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="stack in stacks" :key="stack" :value="stack">{{ stack }}</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-2">Position</label>
          <select v-model="selectedPosition" class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
          </select>
        </div>
      </div>

      <!-- Image -->
      <div class="w-full md:w-2/3 text-center">
        <div v-if="imagePath">
          <img
            :src="imagePath"
            alt="Range"
            class="max-w-full max-h-[600px] mx-auto rounded-xl shadow-md border"
          />
          <p class="text-sm text-gray-500 italic mt-2">
            {{ imagePath }}
          </p>
        </div>
        <div v-else class="text-gray-400 italic mt-4">
          Veuillez sélectionner une stack et une position
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const stacks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const positions = ['UTG', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

const selectedStack = ref(100)
const selectedPosition = ref('LJ')

const imagePath = computed(() => {
  if (!selectedStack.value || !selectedPosition.value) return null
  return `/img/${selectedStack.value}BB/${selectedPosition.value}.png`
})
</script>

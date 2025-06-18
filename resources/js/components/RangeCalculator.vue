<template>
    <div class="p-6 max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-center">Calculateur de Range GTO</h2>

        <div class="flex flex-wrap justify-center gap-6 mb-6">
            <div>
                <label class="block font-semibold mb-1">Position</label>
                <select v-model="position" class="border px-3 py-2 rounded shadow">
                    <option v-for="p in positions" :key="p">{{ p }}</option>
                </select>
            </div>

            <div>
                <label class="block font-semibold mb-1">Stack (BB)</label>
                <select v-model="stack" class="border px-3 py-2 rounded shadow">
                    <option v-for="s in stacks" :key="s">{{ s }}</option>
                </select>
            </div>

            <div>
                <label class="block font-semibold mb-1">Street</label>
                <select v-model="street" class="border px-3 py-2 rounded shadow">
                    <option v-for="s in streets" :key="s">{{ s }}</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="border-collapse shadow-xl">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="col in ranks" :key="'head-' + col"
                            class="px-2 py-1 border text-sm bg-gray-100 text-center">
                            {{ col }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(rowRank, i) in ranks" :key="'row-' + rowRank">
                        <th class="px-2 py-1 border text-sm bg-gray-100 text-center">{{ rowRank }}</th>
                        <td v-for="(colRank, j) in ranks" :key="'cell-' + rowRank + '-' + colRank"
                            class="w-12 h-12 text-xs text-center align-middle border font-semibold" :style="{
                                backgroundColor: getColor(getHand(i, j)),
                                color: getColor(getHand(i, j)) === 'white' ? '#000' : '#fff',
                                cursor: 'default'
                            }" title="getHand(i, j)">
                            {{ getHand(i, j) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="display: flex;">
            <div v-for="(color, key) in colorMap" :key="'legend-' + key">
                <div :style="{
                    backgroundColor: color,
                    width: '30px',
                    height: '30px',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    display: 'flex',
                    marginRight: '8px',
                    marginLeft: '20px',
                }"></div>
                <span style="margin-left:20px;">{{ key || 'fold' }}</span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ranges from '@/data/ranges.json'

const positions = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const stacks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const streets = ['preflop', 'flop', 'turn', 'river']
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const position = ref('UTG')
const stack = ref(20)
const street = ref('preflop')

const gridData = computed(() => {
    return ranges?.[position.value]?.[stack.value]?.[street.value] || {}
})

const colorMap: Record<string, string> = {
    'call': '#4ade80',     // green-400
    'raise': '#f97316',    // orange-500
    'all-in': '#ef4444',   // red-500
    '': 'white'
}

function getHand(i: number, j: number): string {
    const r1 = ranks[i]
    const r2 = ranks[j]
    if (i === j) return r1 + r2
    return i < j ? r1 + r2 + 's' : r2 + r1 + 'o'
}

function getColor(hand: string): string {
    return colorMap[gridData.value[hand] || ''] || 'white'
}
</script>

<style scoped>
table {
    width: auto;
    border-spacing: 4px;
    margin: 10px;
    /* espace entre les cellules */
}

td,
th {
    border: 2px solid #ccc;
    /* bordures visibles */
    padding: 8px;
    /* plus d’espace */
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
}
</style>

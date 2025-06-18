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
                                backgroundColor: getActionColor(getHand(i, j)),
                                color: getTextColor(getHand(i, j)),
                                cursor: 'default',
                            }" :title="getHand(i, j)">
                            {{ getHandDisplay(i, j) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <div style="display:flex; justify-content: center;">
                <div v-for="item in filteredColorMap" :key="'legend-' + item.key"
                    class="flex items-center">
                    <div :style="{
                        backgroundColor: item.color,
                        width: '30px',
                        height: '30px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        marginRight: '18px',
                        textAlign: 'center',
                    }"></div>
                    <span class="text-sm">{{ item.key }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
type Position = 'UTG' | 'UTG1' | 'UTG2' | 'LJ' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB'

interface RangeActions {
    call: string[]
    raise: string[]
    allin: string[]
}

interface PositionRanges {
    [position: string]: RangeActions
}

interface StackRanges {
    [stack: string]: PositionRanges
}

interface FullGTORanges {
    GTO_Ranges: StackRanges
}

const positions: Position[] = ['UTG', 'UTG1', 'UTG2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const stacks = [10, 20, 30, 40, 50, 100]
const ranks: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const position = ref<Position>('UTG')
const stack = ref<number>(100)

const gtoRanges: FullGTORanges = {
    GTO_Ranges: {
        "10bb": {
            "UTG": {
                "call": ["88-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "UTG1": {
                "call": ["88-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "UTG2": {
                "call": ["88-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "LJ": {
                "call": ["77-99"],
                "raise": ["TT+", "ATs+"],
                "allin": ["AA", "KK", "AK"]
            },
            "HJ": {
                "call": ["66-99"],
                "raise": ["TT+", "A8s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "CO": {
                "call": ["55-99"],
                "raise": ["TT+", "A7s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A5s+"],
                "allin": ["AA", "KK"]
            },
            "SB": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            },
            "BB": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            }
        },
        "20bb": {
            "UTG": {
                "call": ["77-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "UTG1": {
                "call": ["77-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "UTG2": {
                "call": ["77-99"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "LJ": {
                "call": ["66-99"],
                "raise": ["TT+", "ATs+"],
                "allin": ["AA", "KK", "AK"]
            },
            "HJ": {
                "call": ["55-99"],
                "raise": ["TT+", "A8s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "CO": {
                "call": ["44-99"],
                "raise": ["TT+", "A7s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A5s+"],
                "allin": ["AA", "KK"]
            },
            "SB": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            },
            "BB": {
                "call": ["22+", "A2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            }
        },
        "30bb": {
            "UTG": {
                "call": ["66-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG1": {
                "call": ["66-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG2": {
                "call": ["66-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "LJ": {
                "call": ["55-99", "A9s+", "KTs+"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "HJ": {
                "call": ["44-99", "A7s+", "K9s+"],
                "raise": ["TT+", "ATs+"],
                "allin": ["AA", "KK", "AK"]
            },
            "CO": {
                "call": ["33-99", "A5s+", "K7s+"],
                "raise": ["TT+", "A9s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A7s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "SB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A5s+"],
                "allin": ["AA", "KK"]
            },
            "BB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            }
        },
        "40bb": {
            "UTG": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG1": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG2": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "LJ": {
                "call": ["44-99", "A9s+", "KTs+"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "HJ": {
                "call": ["33-99", "A7s+", "K9s+"],
                "raise": ["TT+", "ATs+"],
                "allin": ["AA", "KK", "AK"]
            },
            "CO": {
                "call": ["22+", "A5s+", "K7s+"],
                "raise": ["TT+", "A9s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A7s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "SB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A5s+"],
                "allin": ["AA", "KK"]
            },
            "BB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            }
        },
        "50bb": {
            "UTG": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG1": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "UTG2": {
                "call": ["55-99", "AJs", "KQs"],
                "raise": ["TT+", "AQs+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "LJ": {
                "call": ["44-99", "A9s+", "KTs+"],
                "raise": ["TT+", "AJs+"],
                "allin": ["AA", "KK", "QQ", "AK"]
            },
            "HJ": {
                "call": ["33-99", "A7s+", "K9s+"],
                "raise": ["TT+", "ATs+"],
                "allin": ["AA", "KK", "AK"]
            },
            "CO": {
                "call": ["22+", "A2s+", "K7s+"],
                "raise": ["TT+", "A9s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A7s+"],
                "allin": ["AA", "KK", "AK"]
            },
            "SB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A5s+"],
                "allin": ["AA", "KK"]
            },
            "BB": {
                "call": ["22+", "A2s+", "K2s+"],
                "raise": ["TT+", "A2s+"],
                "allin": ["AA", "KK"]
            }
        },
        "100bb": {
            "UTG": {
                "call": ["22-99", "AJs", "KQs", "QJs", "JTs", "T9s"],
                "raise": ["TT+", "AQs+", "AQo+"],
                "allin": ["AA", "KK"]
            },
            "UTG1": {
                "call": ["22-99", "AJs", "KQs", "QJs", "JTs"],
                "raise": ["TT+", "AQs+", "AQo+"],
                "allin": ["AA", "KK"]
            },
            "UTG2": {
                "call": ["22-99", "AJs", "KQs", "QJs"],
                "raise": ["TT+", "AQs+", "AQo+"],
                "allin": ["AA", "KK"]
            },
            "LJ": {
                "call": ["22-99", "A2s+", "KTs+", "QTs+", "J9s+"],
                "raise": ["TT+", "AJs+", "AQo+"],
                "allin": ["AA", "KK", "QQ"]
            },
            "HJ": {
                "call": ["22-99", "A2s+", "K9s+", "Q9s+", "J8s+"],
                "raise": ["TT+", "ATs+", "AJo+"],
                "allin": ["AA", "KK", "QQ", "AKs"]
            },
            "CO": {
                "call": ["22+", "A2s+", "K7s+", "Q8s+", "J7s+"],
                "raise": ["TT+", "A9s+", "A9o+"],
                "allin": ["AA", "KK", "AK"]
            },
            "BTN": {
                "call": ["22+", "A2s+", "K2s+", "Q2s+", "J2s+"],
                "raise": ["TT+", "A7s+", "A9o+"],
                "allin": ["AA", "KK", "AK", "QQ"]
            },
            "SB": {
                "call": ["22+", "A2s+", "K2s+", "Q2s+", "J2s+"],
                "raise": ["TT+", "A5s+", "A7o+"],
                "allin": ["AA", "KK", "AK", "QQ"]
            },
            "BB": {
                "call": ["22+", "A2s+", "K2s+", "Q2s+", "J2s+"],
                "raise": ["TT+", "A2s+", "A5o+"],
                "allin": ["AA", "KK", "AK"]
            }
        }
    }
}

const currentRange = computed(() => {
    const stackKey = `${stack.value}bb`
    const stackRanges = gtoRanges.GTO_Ranges[stackKey]
    return stackRanges?.[position.value] || { call: [], raise: [], allin: [] }
})

const colorMap = {
    'call': '#4ade80',    // Vert
    'raise': '#f97316',   // Orange
    'allin': '#ef4444',   // Rouge
    '': 'white'           // Blanc (hors range)
}

const filteredColorMap = computed(() => {
    return Object.entries(colorMap)
        .filter(([key]) => key !== '')
        .map(([key, color]) => ({ key, color }))
})

function getHand(i: number, j: number): string {
    const r1 = ranks[i]
    const r2 = ranks[j]
    if (i === j) return `${r1}${r2}`
    return i < j ? `${r1}${r2}s` : `${r2}${r1}o`
}

function getHandDisplay(i: number, j: number): string {
    const r1 = ranks[i]
    const r2 = ranks[j]
    if (i === j) return `${r1}${r2}`
    return i < j ? `${r1}${r2}s` : `${r2}${r1}o`
}

function getActionColor(hand: string): string {
    if (isHandInRange(hand, currentRange.value.allin)) return colorMap['allin']
    if (isHandInRange(hand, currentRange.value.raise)) return colorMap['raise']
    if (isHandInRange(hand, currentRange.value.call)) return colorMap['call']
    return colorMap['']
}

function getTextColor(hand: string): string {
    return getActionColor(hand) !== colorMap[''] ? '#fff' : '#000'
}

function isHandInRange(hand: string, rangeList: string[]): boolean {
    return rangeList.some(rangeHand => handMatchesRange(hand, rangeHand))
}

function handMatchesRange(hand: string, rangeHand: string): boolean {
    // Gestion des paires (ex: "22-99")
    if (rangeHand.includes('-')) {
        const [low, high] = rangeHand.split('-')
        if (hand.length === 2 && hand[0] === hand[1]) {
            const handRank = hand[0] as Rank
            const lowRank = low[0] as Rank
            const highRank = high[0] as Rank
            return ranks.indexOf(handRank) >= ranks.indexOf(lowRank) &&
                ranks.indexOf(handRank) <= ranks.indexOf(highRank)
        }
        return false
    }

    // Gestion des "+" (ex: "TT+")
    if (rangeHand.endsWith('+') && hand.length === 2 && hand[0] === hand[1]) {
        const minRank = rangeHand[0] as Rank
        const handRank = hand[0] as Rank
        return ranks.indexOf(handRank) <= ranks.indexOf(minRank)
    }

    // Gestion des "s+" (ex: "AJs+")
    if (rangeHand.endsWith('s+') && hand.endsWith('s')) {
        const base = rangeHand.slice(0, 2)
        if (hand.startsWith(base)) return true
        const rangeHigh = base[0] as Rank
        const rangeLow = base[1] as Rank
        const handHigh = hand[0] as Rank
        const handLow = hand[1] as Rank
        return handHigh === rangeHigh && ranks.indexOf(handLow) <= ranks.indexOf(rangeLow)
    }

    // Gestion des "o+" (ex: "AQo+")
    if (rangeHand.endsWith('o+') && hand.endsWith('o')) {
        const base = rangeHand.slice(0, 2)
        if (hand.startsWith(base)) return true
        const rangeHigh = base[0] as Rank
        const rangeLow = base[1] as Rank
        const handHigh = hand[0] as Rank
        const handLow = hand[1] as Rank
        return handHigh === rangeHigh && ranks.indexOf(handLow) <= ranks.indexOf(rangeLow)
    }

    // Match exact
    return hand === rangeHand
}
</script>

<style scoped>
table {
    width: auto;
    border-spacing: 4px;
    margin: 10px auto;
}

td,
th {
    border: 2px solid #ccc;
    padding: 0 8px;
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
}
</style>
export interface Card {
  code: string;      // ex: "A♥"
  rank: string;      // ex: "A"
  suit: string;      // ex: "♥"
  label: string;     // ex: "As" (affichage)
}

const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

/**
 * Détecte un tirage quinte dans les cartes données.
 * Retourne "open-ended", "gutshot", ou null.
 */
function detectStraightDraw(cards: Card[]): 'open-ended' | 'gutshot' | null {
  const values = Array.from(new Set(cards.map(c => rankOrder.indexOf(c.rank)))).sort((a, b) => a - b)

  // Cas spécial pour A-2-3-4-5
  if (values.includes(0) && values.includes(1) && values.includes(2) && values.includes(3) && values.includes(12)) {
    return 'open-ended'
  }

  for (let i = 0; i <= values.length - 4; i++) {
    const slice = values.slice(i, i + 4)

    // Open-ended
    if (slice[3] - slice[0] === 3 && slice.length === 4) {
      return 'open-ended'
    }

    // Gutshot
    if (i <= values.length - 5) {
      const five = values.slice(i, i + 5)
      const expected = [five[0], five[0] + 1, five[0] + 2, five[0] + 3, five[0] + 4]
      const missing = expected.filter(v => !five.includes(v))
      if (missing.length === 1) return 'gutshot'
    }
  }

  return null
}

export function computeOuts(hand: Card[], flop: Card[], turn?: Card, river?: Card) {
  const known = [...hand, ...flop]
  if (turn) known.push(turn)
  if (river) known.push(river)

  const suits = ['♥', '♦', '♣', '♠']
  const fullDeck = rankOrder.flatMap(rank => suits.map(suit => ({
    code: rank + suit,
    rank,
    suit
  })))

  let outs = 0
  const draws: string[] = []

  // 🟦 Détection flush draw
  const suitCounts: Record<string, Card[]> = {}
  for (const card of known) {
    if (!suitCounts[card.suit]) suitCounts[card.suit] = []
    suitCounts[card.suit].push(card)
  }

  for (const suit in suitCounts) {
    if (suitCounts[suit].length === 4) {
      draws.push('Tirage couleur')
      outs += 9 // toujours 9 outs pour flush draw
    }
  }

  // 🟧 Détection tirage quinte
  const straightType = detectStraightDraw(known)
  if (straightType === 'open-ended') {
    draws.push('Tirage quinte (open-ended)')
    outs += 8
  } else if (straightType === 'gutshot') {
    draws.push('Tirage quinte (gutshot)')
    outs += 4
  }

  // 🟥 Overcards (optionnel)
  const boardRanks = flop.map(c => rankOrder.indexOf(c.rank))
  const maxBoard = Math.max(...boardRanks)
  for (const c of hand) {
    const val = rankOrder.indexOf(c.rank)
    if (val > maxBoard) {
      draws.push('Overcard')
      outs += 3 // A affiner : ici, on suppose qu’une overcard touchée donne une top paire gagnante
    }
  }

  // 🧪 Cap max : 15 outs dans cas standards (évite double comptage)
  outs = Math.min(outs, 15)

  const percentage = outs * 4 // approximation "rule of 4"

  return {
    outs,
    percentage,
    draws: Array.from(new Set(draws))
  }
}

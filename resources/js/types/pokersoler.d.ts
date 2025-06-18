// src/types/pokersolver.d.ts
declare module 'pokersolver' {
  export class Card {
    static isCard(card: string): boolean
  }

  export class Hand {
    static solve(cards: string[]): Hand
    static winners(hands: Hand[]): Hand[]
    name: string
    descr: string
    cards: string[]
  }
}

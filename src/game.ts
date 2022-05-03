// A card has a rank, a suite (which includes color info), and a deck.
// We could use an object, but for a little efficiency we bit pack these into 9 bits - 4 bits for rank (1-13), 2 for suite, and 3 for deck.
// It could be a lovely as-god-intended byte if we limit to 4 players, but there's not really a need for that, except aesthetic & religious purity.
// We could just number cards 0-51 but then we have to use division (instead of bit operations) to get suites and color, and I cannot abide that
// We could use 0-12 for rank, but it costs us nothing to have a little readability

export type Card = number;

export const cardRank = (card: Card) => card & 0b000001111;
export const cardSuite = (card: Card) => ((card & 0b000110000) >> 4) as Suite;
export const cardColor = (card: Card) => ((card & 0b000010000) >> 4) as Color;
export const cardDeck = (card: Card) => (card & 0b111000000) >> 6;

export enum Suite {
  Clubs,
  Diamonds,
  Spades,
  Hearts,
}

export enum Color {
  Black,
  Red,
}

export const suitemoji = ['♣︎', '♦️', '♠️', '♥️'];
export const rankmoji = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];

export function newCard(name: string, deck?: number): Card;
export function newCard(rank: number, suite: number, deck?: number): Card;
export function newCard(...args: [number | string, number?, number?]): Card {
  return typeof args[0] === 'number'
    ? args[0] | (args[1]! << 4) | ((args[2]! ?? 0) << 6)
    : (rankmoji.indexOf((args[0] as string).slice(2)) + 1) |
        (suitemoji.indexOf((args[0] as string).slice(0, 2)) << 4) |
        ((args[1]! ?? 0) << 6);
}

export function cardName(card: Card): string {
  return `${suitemoji[cardSuite(card)]}${rankmoji[cardRank(card) - 1]}`;
}

export function newPile(cards: string[]): Pile {
  return cards.map(newCard);
}

export function pileToString(pile: Pile) {
  return pile.map(cardName).join('-');
}

export type Pile = Card[];

export interface Hand {
  player: {
    draw: Pile;
    drawDiscard: Pile;
    nerds: Pile;
    nerdsDiscard: Pile;
    work: Pile[];

    // A guess as to how we'll share each player's "I'm moving a card" state
    // cardInMotion: Card,
    // cardInMotionX: Number,
    // cardInMotionY: Number,
    // cardPileSource: PileType,
    // cardPileIndex: Number,
  }[];
  ace: Pile[];
}

export function cardPlaysOnWorkPile(card: Card, pile: Pile) {
  const len = pile.length;

  if (len === 0) return true;

  const top = pile[len - 1];

  return (
    cardColor(top) !== cardColor(card) && cardRank(top) === cardRank(card) + 1
  );
}

export function cardPlaysUnderWorkPile(card: Card, pile: Pile) {
  if (pile.length === 0) return false;

  const bottom = pile[0];

  return (
    cardColor(bottom) !== cardColor(card) &&
    cardRank(bottom) === cardRank(card) - 1
  );
}

export function hasEmptyWorkPile(work: Pile[]) {
  return work.some(pile => pile.length === 0);
}

export function workPilePlaysOnWorkPile(src: Pile, dst: Pile) {
  return cardPlaysOnWorkPile(src[0], dst);
}

export function workPilePlayUnderWorkPile(src: Pile, dst: Pile) {
  return cardPlaysOnWorkPile(src[src.length - 1], dst);
}

export function cardPlaysOnAcePile(card: Card, pile: Pile) {
  const len = pile.length;
  if (len === 0) return false;
  const top = pile[len - 1];
  return (
    cardSuite(top) === cardSuite(card) && cardRank(top) === cardRank(card) - 1
  );
}

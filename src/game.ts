// A card has a rank, a suite (which includes color info), and a deck.
// We could use an object, but for a little efficiency we bit pack these into 9 bits - 4 bits for rank (0-12), 2 for suite, and 3 for deck.
// It could be a lovely as-god-intended byte if we limit to 4 players, but there's not really a need for that, except aesthetic & religious purity.
// We could just number cards 0-51 but then we have to use division (instead of bit operations) to get suites and color, and I cannot abide that

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

export const newCard = (rank: number, suite: Suite, deck = 0) =>
  rank | (suite << 4) | (deck << 6);

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

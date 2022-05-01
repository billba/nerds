// A card has a rank, a suite (which includes color info), and a deck.
// We could use an object, but for a little efficiency we bit pack these into 9 bits - 4 bits for rank (0-12), 2 for suite, and 3 for deck.
// It could be a lovely as-god-intended byte if we limit to 4 players, but there's not really a need for that, except aesthetic & religious purity.
// We could just number cards 0-51 but then we have to use division (instead of bit operations) to get suites and color, and I cannot abide that

type Card = number;

const cardRank = (card: Card) => card & 0b000001111;
const cardSuite = (card: Card) => ((card & 0b000110000) >> 4) as Suite;
const cardColor = (card: Card) => ((card & 0b000010000) >> 4) as Color;
const cardDeck = (card: Card) => (card & 0b111000000) >> 6;

enum Suite {
  Clubs,
  Diamonds,
  Spades,
  Hearts,
}

enum Color {
  Black,
  Red,
}

const newCard = (rank: number, suite: Suite, deck: number = 0) => rank | (suite << 4) | (deck << 6);

type Pile = Card[];

interface Hand {
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

function cardPlaysOnWorkPile(card: Card, pile: Pile) {
  const len = pile.length;

  if (len === 0) return true;

  const top = pile[len - 1];

  return (
    cardColor(top) !== cardColor(card) && cardRank(top) === cardRank(card) + 1
  );
}

function cardPlaysUnderWorkPile(card: Card, pile: Pile) {
  if (pile.length === 0) return false;

  const bottom = pile[0];

  return (
    cardColor(bottom) !== cardColor(card) &&
    cardRank(bottom) === cardRank(card) - 1
  );
}

function hasEmptyWorkPile(work: Pile[]) {
  return work.some(pile => pile.length === 0);
}

function workPilePlaysOnWorkPile(src: Pile, dst: Pile) {
  return cardPlaysOnWorkPile(src[0], dst);
}

function workPilePlayUnderWorkPile(src: Pile, dst: Pile) {
  return cardPlaysOnWorkPile(src[src.length - 1], dst);
}

function cardPlaysOnAcePile(card: Card, pile: Pile) {
  const len = pile.length;
  if (len === 0) return false;
  const top = pile[len - 1];
  return (
    cardSuite(top) === cardSuite(card) && cardRank(top) === cardRank(card) - 1
  );
}

const card = newCard(4, Suite.Hearts);
console.log(card, cardRank(card), cardSuite(card), cardColor(card), cardDeck(card));
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
    ? args[0] | (args[1]! << 4) | ((args[2] ?? 0) << 6)
    : (rankmoji.indexOf(args[0].slice(2)) + 1) |
        (suitemoji.indexOf(args[0].slice(0, 2)) << 4) |
        ((args[1] ?? 0) << 6);
}

export function cardName(card: Card): string {
  return `${suitemoji[cardSuite(card)]}${rankmoji[cardRank(card) - 1]}`;
}

export type Pile = Card[];

export function topCard(pile: Pile) {
  const len = pile.length;
  if (len === 0) throw 'Empty pile';
  return pile[len - 1];
}

export function newPile(cards: string[]): Pile;
export function newPile(cards: string): Pile;
export function newPile(cards: string | string[]): Pile {
  return (typeof cards === 'string' ? cards.split('-') : cards).map(card =>
    newCard(card)
  );
}

export function pileToString(pile: Pile) {
  return pile.map(cardName).join('-');
}

export interface PlayerState {
  drawPile: Pile;
  drawDiscardPile: Pile;
  nerdsPile: Pile;
  nerdsDiscardPile: Pile;
  workPiles: Pile[];
}

export interface HandState {
  players: PlayerState[];
  acePiles: Pile[];
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
  if (work.length !== 4) throw 'Must have 4 work piles';
  return work.some(pile => pile.length === 0);
}

export function workPilePlaysOnWorkPile(src: Pile, dst: Pile) {
  if (src.length === 0) throw 'Source work pile must be non-empty';
  return cardPlaysOnWorkPile(src[0], dst);
}

export function cardPlaysOnAcePile(card: Card, pile: Pile) {
  const len = pile.length;
  if (len === 0) return cardRank(card) === 1;
  const top = pile[len - 1];
  return (
    cardSuite(top) === cardSuite(card) && cardRank(top) === cardRank(card) - 1
  );
}

export function newShuffledDeck(deck = 0): Pile {
  const pile: Pile = [];

  for (let suite = 0; suite < 4; suite++) {
    for (let rank = 0; rank < 13; rank++) {
      pile.push(newCard(rank + 1, suite, deck));
    }
  }

  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }

  return pile;
}

export function newHand(numPlayers: number): HandState {
  const players: PlayerState[] = [];
  for (let player = 0; player < numPlayers; player++) {
    const drawPile = newShuffledDeck(player);

    const workPiles: Pile[] = [];
    for (let i = 0; i < 4; i++) {
      workPiles.push([drawPile.pop()!]);
    }

    const nerdsPile: Pile = [];
    for (let i = 0; i < 13; i++) {
      nerdsPile.push(drawPile.pop()!);
    }

    players.push({
      drawPile,
      drawDiscardPile: [],
      nerdsPile,
      nerdsDiscardPile: [],
      workPiles,
    });
  }

  return {
    players,
    acePiles: new Array(4 * numPlayers).fill([])
  };
}

export type Action =
  | {
      name: 'NoPlay';
      playerIndex: number;
    }
  | {
      name: 'CallNerds';
      playerIndex: number;
    }
  | {
      name: 'DiscardNerds';
      playerIndex: number;
    }
  | {
      name: 'DiscardDraw';
      playerIndex: number;
    }
  | {
      name: 'CycleDraw';
      playerIndex: number;
    }
  | {
      name: 'PlayDrawDiscardOnAcePile';
      playerIndex: number;
      acePileIndex: number;
    }
  | {
      name: 'PlayDrawDiscardOnOrUnderWorkPile';
      playerIndex: number;
      workPileIndex: number;
    }
  | {
      name: 'PlayNerdsDiscardOnAcePile';
      playerIndex: number;
      acePileIndex: number;
    }
  | {
      name: 'PlayNerdsDiscardOnOrUnderWorkPile';
      playerIndex: number;
      workPileIndex: number;
    }
  | {
      name: 'PlayWorkPileCardOnAcePile';
      playerIndex: number;
      workPileIndex: number;
      acePileIndex: number;
    }
  | {
      name: 'PlayWorkPileCardOnOrUnderWorkPile';
      playerIndex: number;
      workPileIndex: number;
      dstWorkPileIndex: number;
    }
  | {
      name: 'PlayWorkPileOnOrUnderWorkPile';
      playerIndex: number;
      workPileIndex: number;
      dstWorkPileIndex: number;
    };

function arrayWithUpdatedElement<T>(
  array: Array<T>,
  elementIndex: number,
  element: T
): Array<T> {
  return [
    ...array.slice(0, elementIndex),
    element,
    ...array.slice(elementIndex + 1),
  ];
}

interface HandUpdate {
  playerIndex?: number;
  ps?: Partial<PlayerState>;
  acePileIndex?: number;
  acePile?: Pile;
}

function handUpdate(
  hand: HandState,
  {playerIndex, ps, acePileIndex, acePile}: HandUpdate
): HandState {
  return {
    players:
      playerIndex === undefined
        ? hand.players
        : arrayWithUpdatedElement(hand.players, playerIndex, {
            ...hand.players[playerIndex],
            ...ps!,
          }),
    acePiles:
      acePileIndex === undefined
        ? hand.acePiles
        : arrayWithUpdatedElement(hand.acePiles, acePileIndex, acePile!),
  };
}

function playPileOnOrUnderWorkpile(pile: Pile, workPile: Pile) {
  return workPile.length === 0
    ? pile
    : cardRank(pile[0]) < cardRank(workPile[0])
    ? [...workPile, ...pile]
    : [...pile, ...workPile];
}

export function reducer(hand: HandState, action: Action): HandState {
  const {playerIndex} = action;
  const ps = hand.players[playerIndex];
  switch (action.name) {
    case 'DiscardDraw': {
      const numCards = Math.min(3, ps.drawPile.length);
      return handUpdate(hand, {
        playerIndex,
        ps: {
          drawPile: ps.drawPile.slice(0, -numCards),
          drawDiscardPile: [
            ...ps.drawDiscardPile,
            ...ps.drawPile.slice(-numCards).reverse(),
          ],
        },
      });
    }
    case 'DiscardNerds':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          nerdsPile: ps.nerdsPile.slice(0, -1),
          nerdsDiscardPile: ps.nerdsPile.slice(-1),
        },
      });
    case 'CycleDraw':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          drawPile: ps.drawDiscardPile.slice().reverse(),
          drawDiscardPile: [],
        },
      });
    case 'PlayDrawDiscardOnAcePile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          drawDiscardPile: ps.drawDiscardPile.slice(0, -1),
        },
        acePileIndex: action.acePileIndex,
        acePile: [
          ...hand.acePiles[action.acePileIndex],
          topCard(ps.drawDiscardPile),
        ],
      });
    case 'PlayDrawDiscardOnOrUnderWorkPile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          drawDiscardPile: ps.drawDiscardPile.slice(0, -1),
          workPiles: arrayWithUpdatedElement(
            ps.workPiles,
            action.workPileIndex,
            playPileOnOrUnderWorkpile(
              ps.drawDiscardPile.slice(-1),
              ps.workPiles[action.workPileIndex]
            )
          ),
        },
      });
    case 'PlayNerdsDiscardOnAcePile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          nerdsDiscardPile: [],
        },
        acePileIndex: action.acePileIndex,
        acePile: [
          ...hand.acePiles[action.acePileIndex],
          topCard(ps.nerdsDiscardPile),
        ],
      });
    case 'PlayNerdsDiscardOnOrUnderWorkPile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          nerdsDiscardPile: [],
          workPiles: arrayWithUpdatedElement(
            ps.workPiles,
            action.workPileIndex,
            playPileOnOrUnderWorkpile(
              ps.nerdsDiscardPile.slice(-1),
              ps.workPiles[action.workPileIndex]
            )
          ),
        },
      });
    case 'PlayWorkPileCardOnAcePile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          workPiles: arrayWithUpdatedElement(
            ps.workPiles,
            action.workPileIndex,
            ps.workPiles[action.workPileIndex].slice(0, -1)
          ),
        },
        acePileIndex: action.acePileIndex,
        acePile: [
          ...hand.acePiles[action.acePileIndex],
          ...ps.workPiles[action.workPileIndex].slice(-1),
        ],
      });
    case 'PlayWorkPileCardOnOrUnderWorkPile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          workPiles: arrayWithUpdatedElement(
            arrayWithUpdatedElement(ps.workPiles, action.workPileIndex, ps.workPiles[action.workPileIndex].slice(0, -1)),
            action.dstWorkPileIndex,
            playPileOnOrUnderWorkpile(
              ps.workPiles[action.workPileIndex].slice(-1),
              ps.workPiles[action.dstWorkPileIndex]
            )
          ),
        },
      });
    case 'PlayWorkPileOnOrUnderWorkPile':
      return handUpdate(hand, {
        playerIndex,
        ps: {
          workPiles: arrayWithUpdatedElement(
            arrayWithUpdatedElement(ps.workPiles, action.workPileIndex, []),
            action.dstWorkPileIndex,
            playPileOnOrUnderWorkpile(
              ps.workPiles[action.workPileIndex],
              ps.workPiles[action.dstWorkPileIndex]
            )
          ),
        },
      });
    }

  return hand;
}

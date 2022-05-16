import {
  Suite,
  Color,
  newCard,
  cardRank,
  cardSuite,
  cardColor,
  cardDeck,
  cardName,
  newPile,
  pileToString,
  cardPlaysOnWorkPile,
  cardPlaysUnderWorkPile,
  hasEmptyWorkPile,
  workPilePlaysOnWorkPile,
  cardPlaysOnAcePile,
  newShuffledDeck,
  reducer,
  HandState,
} from './game';

const fourCards = ['♥️4', '♣︎10', '♦️K', '♥️A'];

describe('newCard', () => {
  test('4 of hearts, default deck', () => {
    const card = newCard(4, Suite.Hearts);
    expect(cardRank(card)).toBe(4);
    expect(cardSuite(card)).toBe(Suite.Hearts);
    expect(cardColor(card)).toBe(Color.Red);
    expect(cardDeck(card)).toBe(0);
  });

  test('10 of clubs, specify deck', () => {
    const card = newCard(10, Suite.Clubs, 3);
    expect(cardRank(card)).toBe(10);
    expect(cardSuite(card)).toBe(Suite.Clubs);
    expect(cardColor(card)).toBe(Color.Black);
    expect(cardDeck(card)).toBe(3);
  });

  test('4 of hearts via emoji, default deck', () => {
    const card = newCard('♥️4');
    expect(cardRank(card)).toBe(4);
    expect(cardSuite(card)).toBe(Suite.Hearts);
    expect(cardColor(card)).toBe(Color.Red);
    expect(cardDeck(card)).toBe(0);
  });

  test('10 of clubs via emoji, specify deck', () => {
    const card = newCard('♣︎10', 3);
    expect(cardRank(card)).toBe(10);
    expect(cardSuite(card)).toBe(Suite.Clubs);
    expect(cardColor(card)).toBe(Color.Black);
    expect(cardDeck(card)).toBe(3);
  });
});

describe('cardName', () => {
  test('4 of hearts', () => {
    expect(cardName(newCard('♥️4'))).toBe('♥️4');
  });
  test('Jack of clubs', () => {
    expect(cardName(newCard('♣︎10'))).toBe('♣︎10');
  });
});

describe('newPile', () => {
  const fourCardsString = pileToString(newPile(fourCards));

  test('no cards', () => {
    expect(newPile([])).toStrictEqual([]);
  });
  test('one card array', () => {
    expect(newPile(['♥️4'])).toStrictEqual([newCard('♥️4')]);
  });
  test('one card string', () => {
    expect(newPile('♥️4')).toStrictEqual([newCard('♥️4')]);
  });
  test('four cards array', () => {
    expect(newPile(fourCards)).toStrictEqual(
      fourCards.map(card => newCard(card))
    );
  });
  test('four cards string', () => {
    expect(newPile(fourCardsString)).toStrictEqual(
      fourCards.map(card => newCard(card))
    );
  });
});

describe('pileToString', () => {
  test('no cards', () => {
    expect(pileToString(newPile([]))).toBe('');
  });
  test('one card', () => {
    expect(pileToString(newPile('♥️4'))).toBe('♥️4');
  });
  test('four cards', () => {
    expect(pileToString(newPile(fourCards))).toBe('♥️4-♣︎10-♦️K-♥️A');
  });
});

describe('cardPlaysOnWorkPile', () => {
  test('no cards', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile([]))).toBe(true);
  });
  test('one card, different color, same rank', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♣︎4'))).toBe(false);
  });
  test('one card, different color, one rank lower', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♣︎3'))).toBe(false);
  });
  test('one card, same color, one rank higher', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️5'))).toBe(false);
  });
  test('one card, different color, one rank higher', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♣︎5'))).toBe(true);
  });
  test('two cards, different color, same rank', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️5-♣︎4'))).toBe(false);
  });
  test('two cards, different color, one rank lower', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️4-♣︎3'))).toBe(false);
  });
  test('two cards, same color, one rank higher', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♣︎6-♦️5'))).toBe(false);
  });
  test('two cards, different color, one rank higher', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️6-♣︎5'))).toBe(true);
  });
});

describe('cardPlaysUnderWorkPile', () => {
  test('no cards', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile([]))).toBe(false);
  });
  test('one card, different color, same rank', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎4'))).toBe(false);
  });
  test('one card, different color, one rank lower', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎3'))).toBe(true);
  });
  test('one card, same color, one rank lower', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♦️3'))).toBe(false);
  });
  test('one card, different color, one rank higher', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎5'))).toBe(false);
  });
  test('two cards, different color, same rank', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎4-♦️3'))).toBe(
      false
    );
  });
  test('two cards, different color, one rank lower', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♦️3-♣2'))).toBe(
      false
    );
  });
  test('two cards, same color, one rank higher', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♦️5-♣︎4'))).toBe(
      false
    );
  });
  test('two cards, different color, one rank higher', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎3-♦️2'))).toBe(
      true
    );
  });
});

describe('hasEmptyPile', () => {
  test('no work piles', () => {
    expect(() => hasEmptyWorkPile([])).toThrow();
  });
  test('all empty', () => {
    expect(hasEmptyWorkPile([[], [], [], []])).toBe(true);
  });
  test('first empty', () => {
    expect(hasEmptyWorkPile([[], [52], [1], [2]])).toBe(true);
  });
  test('second empty', () => {
    expect(hasEmptyWorkPile([[52], [], [1], [2]])).toBe(true);
  });
  test('last empty', () => {
    expect(hasEmptyWorkPile([[52], [1], [2], []])).toBe(true);
  });
});

describe('workPilePlaysOnWorkPile', () => {
  test('source empty', () => {
    expect(() => workPilePlaysOnWorkPile([], [])).toThrow();
  });
  test('one card on no cards', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile([]))).toBe(true);
  });
  test('one card on one card, different color, same rank', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♣︎4'))).toBe(false);
  });
  test('one card on one card, different color, one rank lower', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♣︎3'))).toBe(false);
  });
  test('one card on one card, same color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♦️5'))).toBe(false);
  });
  test('one card on one card, different color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♣︎5'))).toBe(true);
  });
  test('one card on two cards, different color, same rank', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♦️5-♣︎4'))).toBe(
      false
    );
  });
  test('one card on two cards, different color, one rank lower', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♦️4-♣︎3'))).toBe(
      false
    );
  });
  test('one card on two cards, same color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♣︎6-♦️5'))).toBe(
      false
    );
  });
  test('one card on two cards, different color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4'), newPile('♦️6-♣︎5'))).toBe(
      true
    );
  });
  test('two cards on no cards', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile([]))).toBe(true);
  });
  test('one card on one card, different color, same rank', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♣︎4'))).toBe(
      false
    );
  });
  test('one card on one card, different color, one rank lower', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♣︎3'))).toBe(
      false
    );
  });
  test('one card on one card, same color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♦️5'))).toBe(
      false
    );
  });
  test('one card on one card, different color, one rank higher', () => {
    expect(workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♣︎5'))).toBe(
      true
    );
  });
  test('one card on two cards, different color, same rank', () => {
    expect(
      workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♦️5-♣︎4'))
    ).toBe(false);
  });
  test('one card on two cards, different color, one rank lower', () => {
    expect(
      workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♦️4-♣︎3'))
    ).toBe(false);
  });
  test('one card on two cards, same color, one rank higher', () => {
    expect(
      workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♣︎6-♦️5'))
    ).toBe(false);
  });
  test('one card on two cards, different color, one rank higher', () => {
    expect(
      workPilePlaysOnWorkPile(newPile('♥️4-♣︎3'), newPile('♦️6-♣︎5'))
    ).toBe(true);
  });
});

describe('cardPlaysOnAcePile', () => {
  test('ace on empty pile', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎A'), [])).toBe(true);
  });
  test('non-ace on empty pile', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎4'), [])).toBe(false);
  });
  test('ace on different-suite ace', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎A'), newPile('♦️A'))).toBe(false);
  });
  test('ace on same-suite ace', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎A'), newPile('♣︎A'))).toBe(false);
  });
  test('card on cards, different suite, one rank lower', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎4'), newPile('♦️A-♦️2-♦️3'))).toBe(
      false
    );
  });
  test('card on cards, same suite, one rank lower', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎4'), newPile('♣︎A-♣︎2-♣︎3'))).toBe(
      true
    );
  });
  test('card on cards, different suite, same rank', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎4'), newPile('♦️A-♦️2-♦️3-♦️4'))).toBe(
      false
    );
  });
  test('card on cards, same suite, same rank', () => {
    expect(cardPlaysOnAcePile(newCard('♣︎4'), newPile('♣︎A-♣︎2-♣︎3-♣︎4'))).toBe(
      false
    );
  });
  test('card on cards, different suite, one rank higher', () => {
    expect(
      cardPlaysOnAcePile(newCard('♣︎4'), newPile('♦️A-♦️2-♦️3-♦️4-♦️5'))
    ).toBe(false);
  });
  test('card on cards, same suite, one rank higher', () => {
    expect(
      cardPlaysOnAcePile(newCard('♣︎4'), newPile('♣︎A-♣︎2-♣︎3-♣︎4-♣︎5'))
    ).toBe(false);
  });
});

describe('shuffledDeck', () => {
  test('keeps 52 distinct cards', () => {
    const deck = newShuffledDeck();
    const set = new Set<number>(deck);
    expect(set.size).toBe(52);
  });
});

describe('reducer', () => {
  test('CallNerds', () => {
    const hand: HandState = {
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3'),
          workPiles: [[], [], [], []],
        },
      ],
    };
    expect(
      reducer(hand, {
        name: 'CallNerds',
        playerIndex: 0,
      })
    ).toStrictEqual(hand);
  });

  test('DiscardDraw 4 cards left on empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♣︎3-♦️A-♦️5-♦️9'),
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: newPile('♣︎3'),
          drawDiscardPile: newPile('♦️9-♦️5-♦️A'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 4 cards left on non-empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♣︎3-♦️A-♦️5-♦️9'),
              drawDiscardPile: newPile('♣︎5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: newPile('♣︎3'),
          drawDiscardPile: newPile('♣︎5-♦️9-♦️5-♦️A'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 3 cards left on empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️A-♦️5-♦️9'),
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♦️9-♦️5-♦️A'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 3 cards left on non-empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️A-♦️5-♦️9'),
              drawDiscardPile: newPile('♣︎5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎5-♦️9-♦️5-♦️A'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 2 cards left on empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️5-♦️9'),
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♦️9-♦️5'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 2 cards left on non-empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️5-♦️9'),
              drawDiscardPile: newPile('♣︎5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎5-♦️9-♦️5'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 1 cards left on empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️9'),
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♦️9'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardDraw 1 cards left on non-empty discard', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: newPile('♦️9'),
              drawDiscardPile: newPile('♣︎5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎5-♦️9'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardNerds 2 cards left', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: newPile('♣︎5-♦️9'),
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardNerds',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: newPile('♣︎5'),
          nerdsDiscardPile: newPile('♦️9'),
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('DiscardNerds 1 cards left', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: newPile('♦️9'),
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'DiscardNerds',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: newPile('♦️9'),
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('CycleDraw player 0', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️A-♦️5-♦️9'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'CycleDraw',
          playerIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: newPile('♦️9-♦️5-♦️A-♣︎3'),
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('CycleDraw player 1', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️A-♦️5-♦️9'),
              workPiles: [[], [], [], []],
            },
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️A-♦️5-♦️9'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'CycleDraw',
          playerIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), [], [], newPile('♦️A')],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3-♦️A-♦️5-♦️9'),
          workPiles: [[], [], [], []],
        },
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: newPile('♦️9-♦️5-♦️A'),
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnAcePile 2 cards on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️A'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnAcePile 2 cards on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️2'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A-♦️2'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3'),
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnAcePile 1 card on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️A'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnAcePile 1 card on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️2'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A-♦️2'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayNerdsDiscardOnAcePile on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♦️A'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayNerdsDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayNerdsDiscardOnAcePile on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♦️2'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayNerdsDiscardOnAcePile',
          playerIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A-♦️2'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnOrUnderWorkPile 2 cards on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3'),
          workPiles: [newPile('♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnOrUnderWorkPile 1 card on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️5'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnOrUnderWorkPile 2 cards on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3-♦️5'),
              workPiles: [newPile('♣︎6'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: newPile('♣︎3'),
          workPiles: [newPile('♣︎6-♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnOrUnderWorkPile 1 card on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️5'),
              workPiles: [newPile('♣︎6'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♣︎6-♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayDrawDiscardOnOrUnderWorkPile 1 card under non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♦️5'),
              workPiles: [newPile('♣︎4'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♦️5-♣︎4'), [], [], []],
        },
      ],
    });
  });

  test('PlayNerdsDiscardOnOrUnderWorkPile 1 card on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♦️5'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        {
          name: 'PlayNerdsDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayNerdsDiscardOnOrUnderWorkPile 1 card on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♦️5'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♣︎6'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayNerdsDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♣︎6-♦️5'), [], [], []],
        },
      ],
    });
  });

  test('PlayNerdsDiscardOnOrUnderWorkPile 1 card under non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♦️5'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♣︎4'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayNerdsDiscardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♦️5-♣︎4'), [], [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnAcePile 1 card on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♦️A'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnAcePile',
          playerIndex: 0,
          workPileIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnAcePile 2 cards on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), [], [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️2-♦️A'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnAcePile',
          playerIndex: 0,
          workPileIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♠️2'), [], [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnAcePile 1 card on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♦️2'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnAcePile',
          playerIndex: 0,
          workPileIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A-♦️2'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], [], [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnAcePile 2 cards on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️3-♦️2'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnAcePile',
          playerIndex: 0,
          workPileIndex: 0,
          acePileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A-♦️2'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♠️3'), [], [], []],
        },
      ],
    });
  });

  test('PlayWorkPileOnOrUnderWorkPile 2 cards on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️3-♦️2'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], newPile('♠️3-♦️2'), [], []],
        },
      ],
    });
  });

  test('PlayWorkPileOnOrUnderWorkPile 2 cards on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️3-♦️2'), newPile('♦️4'), [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], newPile('♦️4-♠️3-♦️2'), [], []],
        },
      ],
    });
  });

  test('PlayWorkPileOnOrUnderWorkPile 2 cards under non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♦️4-♠️3'), newPile('♦️2'), [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [[], newPile('♦️4-♠️3-♦️2'), [], []],
        },
      ],
    });
  });

  test('PlayWorkPileOnOrUnderWorkPile 3 cards under non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A'), [], [], []],
          players: [
            {
              nerdsPile: newPile(
                '♦️Q-♥️6-♦️A-♥️A-♣︎7-♦️10-♠️A-♦️J-♠️6-♥️Q-♠️Q'
              ),
              nerdsDiscardPile: newPile('♠️7'),
              drawPile: newPile('♣︎J-♠️K'),
              drawDiscardPile: newPile(
                '♠️J-♣︎9-♦️8-♣︎5-♥️9-♦️5-♦️3-♥️K-♦️6-♠️5-♣︎2-♠️10-♣︎4-♣︎K-♦️7-♥️5-♣︎6-♦️4-♠️3-♥️10-♠️4-♥️8-♠️2-♠️8-♥️2-♥️7-♠️9'
              ),
              workPiles: [
                newPile('♥️3'),
                newPile('♦️K-♣︎Q-♥️J'),
                newPile('♥️4-♣︎3-♦️2'),
                newPile('♣︎10-♦️9-♣︎8'),
              ],
            },
          ],
        },
        {
          name: 'PlayWorkPileOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 1,
          dstWorkPileIndex: 3,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A'), [], [], []],
      players: [
        {
          nerdsPile: newPile('♦️Q-♥️6-♦️A-♥️A-♣︎7-♦️10-♠️A-♦️J-♠️6-♥️Q-♠️Q'),
          nerdsDiscardPile: newPile('♠️7'),
          drawPile: newPile('♣︎J-♠️K'),
          drawDiscardPile: newPile(
            '♠️J-♣︎9-♦️8-♣︎5-♥️9-♦️5-♦️3-♥️K-♦️6-♠️5-♣︎2-♠️10-♣︎4-♣︎K-♦️7-♥️5-♣︎6-♦️4-♠️3-♥️10-♠️4-♥️8-♠️2-♠️8-♥️2-♥️7-♠️9'
          ),
          workPiles: [
            newPile('♥️3'),
            [],
            newPile('♥️4-♣︎3-♦️2'),
            newPile('♦️K-♣︎Q-♥️J-♣︎10-♦️9-♣︎8'),
          ],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnOrUnderWorkPile 2 cards on empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️3-♦️2'), [], [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♠️3'), newPile('♦️2'), [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnOrUnderWorkPile 2 cards on non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♠️3-♦️2'), newPile('♣︎3'), [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♠️3'), newPile('♣︎3-♦️2'), [], []],
        },
      ],
    });
  });

  test('PlayWorkPileCardOnOrUnderWorkPile 2 cards under non-empty pile', () => {
    expect(
      reducer(
        {
          acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [newPile('♦️4-♠️3'), newPile('♦️2'), [], []],
            },
          ],
        },
        {
          name: 'PlayWorkPileCardOnOrUnderWorkPile',
          playerIndex: 0,
          workPileIndex: 0,
          dstWorkPileIndex: 1,
        }
      )
    ).toStrictEqual({
      acePiles: [newPile('♣︎A-♣︎2'), newPile('♦️A'), [], []],
      players: [
        {
          nerdsPile: [],
          nerdsDiscardPile: [],
          drawPile: [],
          drawDiscardPile: [],
          workPiles: [newPile('♦️4'), newPile('♠️3-♦️2'), [], []],
        },
      ],
    });
  });
});

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

  test('Jack of clubs via emoji, specify deck', () => {
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
    expect(newPile(fourCards)).toStrictEqual(fourCards.map(newCard));
  });
  test('four cards string', () => {
    expect(newPile(fourCardsString)).toStrictEqual(fourCards.map(newCard));
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
  test('two cards, different color, top card same rank', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️5-♣︎4'))).toBe(false);
  });
  test('two cards, different color, top card one rank lower', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♦️4-♣︎3'))).toBe(false);
  });
  test('two cards, same color, top card one rank higher', () => {
    expect(cardPlaysOnWorkPile(newCard('♥️4'), newPile('♣︎6-♦️5'))).toBe(false);
  });
  test('two cards, different color, top card one rank higher', () => {
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
  test('two cards, different color, bottom card same rank', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎4-♦️3'))).toBe(
      false
    );
  });
  test('two cards, different color, bottom card one rank lower', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♦️3-♣2'))).toBe(
      false
    );
  });
  test('two cards, same color, bottom card one rank higher', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♦️5-♣︎4'))).toBe(
      false
    );
  });
  test('two cards, different color, bottom card one rank higher', () => {
    expect(cardPlaysUnderWorkPile(newCard('♥️4'), newPile('♣︎3-♦️2'))).toBe(
      true
    );
  });
});

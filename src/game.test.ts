import {
  Suite,
  Color,
  newCard,
  cardRank,
  cardSuite,
  cardColor,
  cardDeck,
  cardName,
} from './game';

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

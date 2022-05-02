import {
  Suite,
  Color,
  newCard,
  cardRank,
  cardSuite,
  cardColor,
  cardDeck,
} from './game';

describe('game fundamentals', () => {
  test('newCard', () => {
    const card = newCard(4, Suite.Hearts);
    expect(cardRank(card)).toBe(4);
    expect(cardSuite(card)).toBe(Suite.Hearts);
    expect(cardColor(card)).toBe(Color.Red);
    expect(cardDeck(card)).toBe(0);
  });
});

import {newPile} from './game';
import {playerAction} from './simulate';

describe('playerAction', () => {
  test('nerds!', () => {
    expect(
      playerAction(
        {
          acePiles: [newPile('♣︎A-♣︎1-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: [],
              drawPile: [],
              drawDiscardPile: newPile('♣︎3'),
              workPiles: [[], [], [], []],
            },
          ],
        },
        0
      )
    ).toStrictEqual({name: 'CallNerds', playerIndex: 0});
  });

  test('nerds on existing ace pile', () => {
    expect(
      playerAction(
        {
          acePiles: [newPile('♣︎A-♣︎1-♣︎2'), [], [], newPile('♦️A')],
          players: [
            {
              nerdsPile: [],
              nerdsDiscardPile: newPile('♣︎3'),
              drawPile: [],
              drawDiscardPile: [],
              workPiles: [[], [], [], []],
            },
          ],
        },
        0
      )
    ).toStrictEqual({
      name: 'PlayNerdsDiscardOnAcePile',
      playerIndex: 0,
      acePileIndex: 0,
    });
  });

  test('nerds on new ace pile', () => {
    expect(
      playerAction(
        {
          acePiles: [newPile('♣︎A-♣︎1-♣︎2'), [], [], []],
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
        0
      )
    ).toStrictEqual({
      name: 'PlayNerdsDiscardOnAcePile',
      playerIndex: 0,
      acePileIndex: 1,
    });
  });
});

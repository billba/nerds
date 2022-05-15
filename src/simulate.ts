import {
  Action,
  HandState,
  topCard,
  cardPlaysOnAcePile,
  cardPlaysOnWorkPile,
  cardPlaysUnderWorkPile,
  workPilePlaysOnWorkPile,
  hasEmptyWorkPile,
  cardName,
  newPile,
  Pile,
} from './game';

// function play(numPlayers: number) {
//   const hand = newHand(numPlayers);
// }

// play(1);

export function playerAction(hand: HandState, playerIndex: number): Action {
  const {acePiles, players} = hand,
    ps = players[playerIndex],
    _hasEmptyWorkPile = hasEmptyWorkPile(ps.workPiles);

  // first attend to the nerds pile, because that's how you end the game
  if (ps.nerdsDiscardPile.length === 0) {
    if (ps.nerdsPile.length === 0) {
      return {name: 'CallNerds', playerIndex};
    } else {
      return {name: 'DiscardNerds', playerIndex};
    }
  } else {
    // try to play the nerds card on ace or work piles
    const card = topCard(ps.nerdsDiscardPile);

    for (const [acePileIndex, acePile] of acePiles.entries()) {
      if (cardPlaysOnAcePile(card, acePile)) {
        return {name: 'PlayNerdsDiscardOnAcePile', playerIndex, acePileIndex};
      }
    }
    for (const [workPileIndex, workPile] of ps.workPiles.entries()) {
      if (
        cardPlaysOnWorkPile(card, workPile) ||
        (_hasEmptyWorkPile && cardPlaysUnderWorkPile(card, workPile))
      ) {
        return {
          name: 'PlayNerdsDiscardOnOrUnderWorkPile',
          playerIndex,
          workPileIndex,
        };
      }
    }
  }

  // try to play work cards/piles on ace piles and other work piles

  for (const [workPileIndex, workPile] of ps.workPiles.entries()) {
    const card = topCard(workPile);

    for (const [acePileIndex, acePile] of acePiles.entries()) {
      if (cardPlaysOnAcePile(card, acePile)) {
        return {
          name: 'PlayWorkPileCardOnAcePile',
          playerIndex,
          workPileIndex,
          acePileIndex,
        };
      }
    }

    for (const [dstWorkPileIndex, dstWorkPile] of ps.workPiles.entries()) {
      if (workPile !== dstWorkPile) {
        if (
          workPilePlaysOnWorkPile(workPile, dstWorkPile) ||
          workPilePlaysOnWorkPile(dstWorkPile, workPile)
        ) {
          return {
            name: 'PlayWorkPileOnOrUnderWorkPile',
            playerIndex,
            workPileIndex,
            dstWorkPileIndex,
          };
        } else if (
          cardPlaysOnWorkPile(card, dstWorkPile) ||
          (_hasEmptyWorkPile && cardPlaysUnderWorkPile(card, dstWorkPile))
        ) {
          return {
            name: 'PlayWorkPileCardOnOrUnderWorkPile',
            playerIndex,
            workPileIndex,
            dstWorkPileIndex,
          };
        }
      }
    }
  }

  // try to play discard card on ace piles and work piles

  if (ps.drawDiscardPile.length > 0) {
    const card = topCard(ps.drawDiscardPile);

    for (const [acePileIndex, acePile] of acePiles.entries()) {
      if (cardPlaysOnAcePile(card, acePile)) {
        return {name: 'PlayDrawDiscardOnAcePile', playerIndex, acePileIndex};
      }
    }
    for (const [workPileIndex, workPile] of ps.workPiles.entries()) {
      if (cardPlaysOnWorkPile(card, workPile)) {
        return {
          name: 'PlayDrawDiscardOnOrUnderWorkPile',
          playerIndex,
          workPileIndex,
        };
      }
    }
  }

  // can't play anything, so discard from draw pile
  if (ps.drawPile.length > 0) {
    return {name: 'DiscardDraw', playerIndex};
  }

  if (ps.drawDiscardPile.length > 0) {
    return {name: 'CycleDraw', playerIndex};
  }

  return {name: 'NoPlay', playerIndex};
}

function pileToString(pile: Pile) {
  return pile.length + (pile.length > 0 ? ':' + cardName(topCard(pile)) : '');
}

function handToString(hand: Partial<HandState>) {
  return (
    'Ace Piles:' +
    hand.acePiles!.map(pileToString).join(' ') +
    hand.players!.map(
      (player, playerIndex) =>
        '\nPlayer ' +
        playerIndex +
        '\n  Work Piles: ' +
        player.workPiles!.map(pileToString).join(' ') +
        '\n  draw: ' +
        player.drawPile.length +
        (player.drawDiscardPile.length > 0
          ? ':' + cardName(player.drawDiscardPile[0])
          : '') +
        '\n  nerds: ' +
        player.nerdsPile.length +
        (player.nerdsDiscardPile.length > 0
          ? ':' + cardName(player.nerdsDiscardPile[0])
          : '')
    )
  );
}

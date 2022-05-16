import { Action, getScores, HandState, newHand, pileToString, reducer } from "./game";
import { playerAction, rand } from "./simulate";

function handToString(hand: Partial<HandState>) {
  return (
    'Ace Piles: \n  ' +
    hand.acePiles!.map(pileToString).join('\n  ') +
    hand.players!.map(
      (player, playerIndex) =>
        '\nPlayer ' +
        playerIndex +
        '\n  Work Piles:\n    ' +
        player.workPiles!.map(pileToString).join('\n    ') +
        '\n  Draw: ' +
        pileToString(player.drawPile) +
        '\n  Draw Discard: ' +
        pileToString(player.drawDiscardPile) +
        '\n  Nerds: ' +
        pileToString(player.nerdsPile) +
        '\n  Nerds Discard: ' +
        pileToString(player.nerdsDiscardPile)
    )
  );
}

function playHand(numPlayers: number) {
  let hand = newHand(numPlayers);
  let action: Action;

  const nextPlay = () => {
    const playerIndex = rand(numPlayers);
    console.log('\x1Bc'); // clear screen
    console.log(handToString(hand));
    action = playerAction(hand, playerIndex);
    console.log(`Next action for player ${playerIndex}`, action);
    console.log(
      '<space> for to play next action, <r> to redeal hand, <ctrl-c> to exit simulator'
    );
  };

  nextPlay();

  // the following keyboard input code comes from https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', key => {
    const k = String(key);
    // ctrl-c exits simulator
    if (k === '\u0003') {
      console.log('EXIT');
      process.exit();
    } else if (k === 'r') {
      hand = newHand(numPlayers);
    } else if (action.name === 'CallNerds') {
      console.log(`PLAYER ${action.playerIndex} CALLED NERDS!`);
      console.log('Scores:');
      const scores = getScores(hand);
      for (const [playerIndex, score] of scores.entries()) {
        console.log(`Player ${playerIndex}: ${score}`);
      }
      process.exit();
    } else {
      hand = reducer(hand, action);
    }

    nextPlay();
  });
}

playHand(3);

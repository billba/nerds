# Rules of the game

*Nerds* is a version of the classic multiplayer solitaire cardgame *Nerts*, of which there are a many variations.

*Nerds* is played by any number of players, each of whom has a standard deck of 52 cards with a distinct back design. In person this is crucial because some of the players' cards will be comingled, and scoring depends, in part, on counting the number of played cards. The computer can solve this problem by counting as cards are played, but it's a fun and recognizable aspect of the game and sowe continue the tradition.

*Nerds* is played as a series of scored hands. At first glance a hand of *Nerds* looks and acts like friends playing parallel games of [3 Card Klondike solitaire](https://gamerules.com/rules/klondike-solitaire/):

* There is a face-down *draw pile*, from which three cards (or as many cards as remain if less than three) are turned face-up at a time onto a *discard pile*. When the last card from the draw pile is discarded, the player may turn the discard pile upside down, at which point it is now the draw pile.
* There are a number of *work piles* onto which players can play the top card from the discard pile. The played card must be one less in rank (aces are low) than the card it is player on, and of an opposite suite color (black 7 on red 8, red jack on black queen). If the bottom card of one work pile may be placed on the top card of another, it may be moved on top of the other in one step.
* When an ace is on top of the discard pile, or any work pile, it may be moved into its own *ace pile*. The player may play the top card of the discard pile, or of any work pile, onto an ace pile if the card is one *higher* in rank than the top card of the ace pile, and of the same suite color.

However these people are not friends, they are bitter enemies, and there are several crucial differences in game play:

* **There are just four work piles, which are dealt with just one face-up card each** rather than the traditional seven stacks of 0-6 face down cards.

* **The ace piles are shared between all players, and are first-come, first-served.** If you put down the ace of clubs, any of the other players may play their two of clubs on it, and so on with the three of clubs, etc. If this is the case, you will have to wait to play *your* two of clubs until another player plays their ace of clubs. 

* **Each player has an additional special draw pile called the *Nerds* pile, and a hand ends when any player exhausts their *Nerds* pile**. At the beginning of the hand each player deals out a separate face-down draw pile of 13 cards called the *Nerds pile*. At the start of play the top card is turned over. It can be played just like the top card of the normal discard pile. If so, the next card is turned over, and so on. When the last Nerds card is played the player yells "Nerds!" (or in this case, clicks the "Nerds!" button). As soon as this happens game play ends, and scoring begins.

* **Hands are scored**. After a hand ends, the number of cards remaining in a player's Nerds pile (including the face-up card) are subtracted from the number of their cards in the ace piles. The player with the highest score wins the hand. If the player with the highest aggregate score exceeds the game's target score (set when the game begins), that player wins the game.

Those are the main differences. Here are some minor clarifications of game play:

* When a work pile is emptied, a new work pile can be created by playing the face-up card from the Nerds pile or the top card of the discard pile. As an optimization, if another work pile could be played on top of this card, you can skip a step and play your card *under* that work pile


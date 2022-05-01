declare type Card = number;
declare const cardRank: (card: Card) => number;
declare const cardSuite: (card: Card) => Suite;
declare const cardColor: (card: Card) => Color;
declare const cardDeck: (card: Card) => number;
declare enum Suite {
    Clubs = 0,
    Diamonds = 1,
    Spades = 2,
    Hearts = 3
}
declare enum Color {
    Black = 0,
    Red = 1
}
declare const newCard: (rank: number, suite: Suite, deck?: number) => number;
declare type Pile = Card[];
interface Hand {
    numPlayers: number;
    player: {
        draw: Pile;
        drawDiscard: Pile;
        nerds: Pile;
        nerdsDiscard: Pile;
        work: Pile[];
    }[];
    ace: Pile[];
}
declare function cardPlaysOnWorkPile(card: Card, pile: Pile): boolean;
declare function cardPlaysUnderWorkPile(card: Card, pile: Pile): boolean;
declare function hasEmptyWorkPile(work: Pile[]): boolean;
declare function workPilePlaysOnWorkPile(src: Pile, dst: Pile): boolean;
declare function workPilePlayUnderWorkPile(src: Pile, dst: Pile): boolean;
declare function cardPlaysOnAcePile(card: Card, pile: Pile): boolean;
declare const card: number;

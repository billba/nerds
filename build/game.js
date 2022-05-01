"use strict";
// A card has a rank, a suite (which includes color info), and a deck.
// We could use an object, but for a little efficiency we bit pack these into 9 bits - 4 bits for rank (0-12), 2 for suite, and 3 for deck.
// It could be a lovely as-god-intended byte if we limit to 4 players, but there's not really a need for that, except aesthetic & religious purity.
const cardRank = (card) => card & 0b000001111;
const cardSuite = (card) => ((card & 0b000110000) >> 4);
const cardColor = (card) => ((card & 0b000010000) >> 4);
const cardDeck = (card) => (card & 0b111000000) >> 6;
var Suite;
(function (Suite) {
    Suite[Suite["Clubs"] = 0] = "Clubs";
    Suite[Suite["Diamonds"] = 1] = "Diamonds";
    Suite[Suite["Spades"] = 2] = "Spades";
    Suite[Suite["Hearts"] = 3] = "Hearts";
})(Suite || (Suite = {}));
var Color;
(function (Color) {
    Color[Color["Black"] = 0] = "Black";
    Color[Color["Red"] = 1] = "Red";
})(Color || (Color = {}));
const newCard = (rank, suite, deck = 0) => rank | (suite << 4) | (deck << 6);
function cardPlaysOnWorkPile(card, pile) {
    const len = pile.length;
    if (len === 0)
        return true;
    const top = pile[len - 1];
    return (cardColor(top) !== cardColor(card) && cardRank(top) === cardRank(card) + 1);
}
function cardPlaysUnderWorkPile(card, pile) {
    if (pile.length === 0)
        return false;
    const bottom = pile[0];
    return (cardColor(bottom) !== cardColor(card) &&
        cardRank(bottom) === cardRank(card) - 1);
}
function hasEmptyWorkPile(work) {
    return work.some(pile => pile.length === 0);
}
function workPilePlaysOnWorkPile(src, dst) {
    return cardPlaysOnWorkPile(src[0], dst);
}
function workPilePlayUnderWorkPile(src, dst) {
    return cardPlaysOnWorkPile(src[src.length - 1], dst);
}
function cardPlaysOnAcePile(card, pile) {
    const len = pile.length;
    if (len === 0)
        return false;
    const top = pile[len - 1];
    return (cardSuite(top) === cardSuite(card) && cardRank(top) === cardRank(card) - 1);
}
const card = newCard(4, Suite.Hearts);
console.log(card, cardRank(card), cardSuite(card), cardColor(card), cardDeck(card));
//# sourceMappingURL=game.js.map
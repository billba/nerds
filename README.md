# Nerds

*Nerds* is a version of the classic multiplayer solitaire cardgame *Nerts*, implemented as a React web app using the [Fluid Framework](https://fluidframework.com) and the [Azure Fluid Relay](https://azure.microsoft.com/en-us/services/fluid-relay/) service.

This is sample code and not an officially maintained Microsoft project. It is licensed under the [MIT License](LICENSE).

# How to use

At the moment this is just simple CLI that shows a game between three simulated players.

1. Clone this repo
2. `npm install`
3. `npm run compile`
4. `node build/simulate`

You will see the current hand (one player only at the moment) and the next action that will be taken. Press `space` to take the action and see the revised hand, `r` to restart the game, or `ctrl-c` to exit.

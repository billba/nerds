# Nerds

*Nerds* is a version of the classic multiplayer solitaire cardgame *Nerts*, implemented as a React web app using the [Fluid Framework](https://fluidframework.com) and the [Azure Fluid Relay](https://azure.microsoft.com/en-us/services/fluid-relay/) service.

This is sample code and not an officially maintained Microsoft project. It is licensed under the [MIT License](LICENSE).

# How to use

At the moment this is just simple CLI UX.

1. Clone this repo
2. `npm install`
3. `npm run compile && node build/simulate`

You will see the current hand (one player only at the moment) and the next action that will be taken. Press any key to take the action and see the revised hand, or ctrl-C to exit. The simulator is not very smart right now and can get stuck.

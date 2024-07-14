# Multiverse Flappy Bird

## Index
- [Features](#features)
- [How to Play](#how-to-play)
- [Tech Stack](#tech-stack)
- [Quickstart](#quickstart)
- [Feedback For LayerZero](#feedback-for-layerzero)

Welcome to Flappy Bird Multiplayer! This game was built for the ETHGlobal Brussels Hackathon. The game is cross-chain fallpy bird, allowing players to use various chains like Base, Optimism, and Arbitrum. Players pay an entry fee to start the game, and the winner takes all the funds, thanks to LayerZero's cross-chain communication.

## Features
- Multiplayer Gameplay: Two players can compete against each other in real-time
- Cross-Chain Compatibility: Choose your preferred chain (Base, Optimism, Arbitrum, etc.) to play.
Entry Fee and Prize: Players pay an entry fee, and the winner takes all the funds.
- Real-Time Leaderboard: See the chains where players and playing the most and the best players.

## How to Play 
1. Connect Your Wallet: Use MetaMask or another Web3 wallet to connect to the game.
2. Select Chain and Pay Entry Fee: Choose your preferred chain and pay the entry fee.
3. Wait for Opponent: Wait for another player to join.
4. Game Starts: Once both players are ready, the game will start with a countdown.
5. Compete: The game continues until one player loses. The winner takes all the funds.

## Tech Stack
- Server: The server handles the game logic and manages the rooms for the players. It ensures that the game starts simultaneously for both players and handles the distribution of funds to the winner.
- Client: The client is a Next.js application that interacts with the server and handles the game UI. It uses Scaffold-ETH for Ethereum interactions and Tailwind CSS for styling.
- Smart Contracts: The smart contracts handle the entry fee and prize distribution. They are deployed on multiple chains to allow cross-chain compatibility.

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

cd my-dapp-example
yarn install


2. Run a local network in the first terminal:

yarn chain


3. On a second terminal, deploy the test contract:

yarn deploy


4. On a third terminal, start your NextJS app:

yarn start


Visit your app on: http://localhost:3000

## Feedback For LayerZero
```
- I would like to see here the example with remix: https://docs.layerzero.network/v2/developers/evm/oapp/overview  and here https://docs.layerzero.network/v2/developers/evm/oft/native-transfer
- foundry examples are missing, would be nice to have different docs for foundry and hardhat
- before “Oapp composing”, I would put “Message design pattern” in the doc here: https://docs.layerzero.network/v2/developers/evm/oapp/message-design-patterns 
- I would put setting peer up in the doc here: https://docs.layerzero.network/v2/developers/evm/oapp/overview#implementing-_lzsend from “implementing_lzSend” is not immediately clear
- I would make the dependencies in OApp.sol  in the example here https://docs.layerzero.network/v2/developers/evm/oapp/overview#implementing-_lzsend as indipendent packages. copypasting that code would require also copypasting the imported contracts
- in omnichain application there is no trace of how to install foundry dependencies
- it seems like there is no foundry documentation
- copypasting the remappings does not work for me
- https://docs.layerzero.network/v2/developers/evm/tooling/test-helper here the test file is huge, recommend give first a minimal example. I’m having a lot of troubles with dependencies
- copypasting the test file here https://docs.layerzero.network/v2/developers/evm/tooling/test-helper gives me this error after compiling `failed to resolve file: "/Users/fabri/hackathon/eth-bru/multiverse-flappy-bird/packages/foundry/node_modules/@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/libs/DVNOptions.sol": No such file or directory (os error 2); check configured remappings`: some library is missing here
    - `DVNOptions` is not found, no idea why
    - we need to install `@layerzerolabs/lz-evm-v1-0.7`
    - and  `@layerzerolabs/lz-evm-messagelib-v2`
- please specfy in the doc that you don’t need to implement the public/external fuction for lzReceive because it’s already implemented in the interface
- setPeer() is not super clear. I would call it in a more descriptive way/ clear in the doc that the peer is the contract on the other chain
    - I did not undeerstand what eid are, they are endpoint in other chains. I think it need to be specified
- TestHelperOz5::setupOApps is tricky. if you add arguments to your oApp and you want to test it using the template, you need to modify this all function (it’s a dependency)
- In my test script I can’t use things like makeAddrAndKey
- not clear on what these options are and how to create them from the frontend
- https://docs.layerzero.network/v2/developers/evm/gas-settings/options#pass-options-in-send-call here is not clear where we get the options from
```

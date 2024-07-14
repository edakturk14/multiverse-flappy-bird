# Multiverse Flappy Bird

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

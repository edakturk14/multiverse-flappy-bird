// Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Flappy} from "../src/Flappy.sol"; // Adjust the path as needed
import {HelperConfig} from "./HelperConfig.s.sol";
import {console2} from "forge-std/console2.sol";

//forge script script/DeployCrossChain.s.sol:DeployCrossChain -vvvv --via-ir
//to actually deploy: forge script script/DeployCrossChain.s.sol:DeployCrossChain -vvvv --via-ir --broadcast
// arb: 0xbB07FA2CbD53277B5e85C62619038D5E2352933f
// base: 0xEe1Af345C5272E3f194881aBEB60FCf0f6e29592
contract SendCrossChainMessage is Script {
    uint256 arbitrumId;
    Flappy arbitrumSepoliaContract;

    function run() external {
        HelperConfig config = new HelperConfig();
        (address deployer, uint256 prKey) = config.getDeployerAndPk();
        // Fork and deploy on arbitrumSepolia
        (string memory arbitrumSepoliaForkUrl, uint32 arbitrumEid, address endpoint) =
            config.getForkConfig("arbitrumSepolia");

        uint256 arbitrumId = vm.createSelectFork(arbitrumSepoliaForkUrl);
        vm.startBroadcast(prKey);
        Flappy arbitrumSepoliaContract = Flappy(0xbB07FA2CbD53277B5e85C62619038D5E2352933f);

        // vm.stopBroadcast();
        // console2.log("Contract deployed on arbitrumSepolia at:", address(arbitrumSepoliaContract));

        // // Fork and deploy on baseSepolia
        // (string memory baseSepoliaForkUrl, uint32 baseEid, address baseEndpoint) = config.getForkConfig("baseSepolia");
        // baseId = vm.createSelectFork(baseSepoliaForkUrl);
        // vm.startBroadcast(prKey);
        // baseSepoliaContract = new Flappy(baseEndpoint, deployer);

        // //setting peers on both chains
        // baseSepoliaContract.setPeer(arbitrumEid, bytes32(uint256(uint160(address(arbitrumSepoliaContract)))));
        // vm.stopBroadcast();
        // vm.selectFork(arbitrumId);
        // vm.startBroadcast(prKey);
        // arbitrumSepoliaContract.setPeer(baseEid, bytes32(uint256(uint160(address(baseSepoliaContract)))));
        // vm.stopBroadcast();
        // console2.log("Contract deployed on baseSepolia at:", address(baseSepoliaContract));
        // owner = deployer;
        // privateKey = prKey;
    }
}

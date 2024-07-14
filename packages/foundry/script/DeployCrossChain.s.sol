// Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Flappy} from "../src/Flappy.sol"; // Adjust the path as needed
import {HelperConfig} from "./HelperConfig.s.sol";
import {console2} from "forge-std/console2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//forge script script/DeployCrossChain.s.sol:DeployCrossChain -vvvv --via-ir
//to actually deploy: forge script script/DeployCrossChain.s.sol:DeployCrossChain -vvvv --via-ir --broadcast

contract DeployCrossChain is Script {
    address public LINK_ARB = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;
    address public LINK_BASE = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

    function run()
        external
        returns (
            Flappy arbitrumSepoliaContract,
            Flappy baseSepoliaContract,
            uint256 arbitrumId,
            uint256 baseId,
            address owner,
            uint256 privateKey
        )
    {
        HelperConfig config = new HelperConfig();
        (address deployer, uint256 prKey) = config.getDeployerAndPk();
        // Fork and deploy on arbitrumSepolia
        (string memory arbitrumSepoliaForkUrl, uint32 arbitrumEid, address endpoint) =
            config.getForkConfig("arbitrumSepolia");

        arbitrumId = vm.createSelectFork(arbitrumSepoliaForkUrl);
        vm.startBroadcast(prKey);
        arbitrumSepoliaContract = new Flappy(endpoint, deployer);
        arbitrumSepoliaContract.addToken(IERC20(LINK_ARB));

        vm.stopBroadcast();
        console2.log("Contract deployed on arbitrumSepolia at:", address(arbitrumSepoliaContract));

        // Fork and deploy on baseSepolia
        (string memory baseSepoliaForkUrl, uint32 baseEid, address baseEndpoint) = config.getForkConfig("baseSepolia");
        baseId = vm.createSelectFork(baseSepoliaForkUrl);
        vm.startBroadcast(prKey);
        baseSepoliaContract = new Flappy(baseEndpoint, deployer);
        baseSepoliaContract.addToken(IERC20(LINK_BASE));

        //setting peers on both chains
        baseSepoliaContract.setPeer(arbitrumEid, bytes32(uint256(uint160(address(arbitrumSepoliaContract)))));
        vm.stopBroadcast();
        vm.selectFork(arbitrumId);
        vm.startBroadcast(prKey);
        arbitrumSepoliaContract.setPeer(baseEid, bytes32(uint256(uint160(address(baseSepoliaContract)))));
        vm.stopBroadcast();
        console2.log("Contract deployed on baseSepolia at:", address(baseSepoliaContract));
        owner = deployer;
        privateKey = prKey;
    }
}

// HelperConfig.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct ForkConfig {
        string forkUrl;
        uint32 eid;
        address endpoint;
    }

    mapping(string => ForkConfig) private forkConfigs;
    address public deployer;
    uint256 public privateKey;

    constructor() {
        deployer = vm.envAddress("DEPLOYER");
        privateKey = vm.envUint("PRIVATE_KEY");

        forkConfigs["arbitrumSepolia"] = ForkConfig({
            forkUrl: vm.rpcUrl("arbitrumSepolia"),
            eid: uint32(40231),
            endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
        });

        forkConfigs["baseSepolia"] = ForkConfig({
            forkUrl: vm.rpcUrl("baseSepolia"),
            eid: uint32(40245),
            endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
        });
    }

    function getDeployerAndPk() public view returns (address dp, uint256 pk) {
        dp = deployer;
        pk = privateKey;
    }

    function getForkConfig(string memory network)
        public
        view
        returns (string memory forkUrl, uint32 eid, address endpoint)
    {
        ForkConfig memory config = forkConfigs[network];
        return (config.forkUrl, config.eid, config.endpoint);
    }
}

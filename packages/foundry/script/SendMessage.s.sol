// Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Flappy} from "../src/Flappy.sol"; // Adjust the path as needed
import {HelperConfig} from "./HelperConfig.s.sol";
import {console2} from "forge-std/console2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SignatureVerifier} from "../src/libraries/SignatureVerifier.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";

//forge script script/SendMessage.s.sol:SendMessage -vvvv --via-ir
//to actually run on chain: forge script script/SendMessage.s.sol:SendMessage -vvvv --via-ir --broadcast
contract SendMessage is Script {
    using OptionsBuilder for bytes;

    function run() external {
        uint256 depositAMount = 1e18;
        HelperConfig config = new HelperConfig();
        (address deployer, uint256 prKey) = config.getDeployerAndPk();
        (string memory arbitrumSepoliaForkUrl, uint32 arbitrumEid, address arbEndpoint) =
            config.getForkConfig("arbitrumSepolia");

        (string memory baseSepoliaForkUrl, uint32 baseEid, address baseEndpoint) = config.getForkConfig("baseSepolia");

        uint256 arbitrumId = vm.createSelectFork(arbitrumSepoliaForkUrl);
        Flappy aFlappy = Flappy(vm.envAddress("ARB_SEPOLIA_FLAPPY"));
        IERC20 aToken = aFlappy.s_token();

        // deposit in arb:
        vm.startBroadcast(prKey);
        aToken.approve(address(aFlappy), depositAMount);
        aFlappy.deposit(depositAMount);
        vm.stopBroadcast();

        // deposit in base:
        uint256 baseId = vm.createSelectFork(baseSepoliaForkUrl);
        Flappy bFlappy = Flappy(vm.envAddress("BASE_SEPOLIA_FLAPPY"));
        IERC20 bToken = bFlappy.s_token();
        vm.startBroadcast(prKey);
        bToken.approve(address(bFlappy), depositAMount);
        bFlappy.deposit(depositAMount);
        vm.stopBroadcast();

        //let's pretend I win on base

        uint256 amount = 1e9;
        uint256 points = 10;

        bytes memory signature = signMessage(deployer, prKey, amount, deployer, deployer, points);

        bytes memory _options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(150000, 0);

        MessagingFee memory msgFee = bFlappy.quote(arbitrumEid, amount, _options, false, points);
        vm.startBroadcast(prKey);
        MessagingReceipt memory receipt =
            bFlappy.endGame{value: msgFee.nativeFee}(arbitrumEid, amount, deployer, points, signature, _options);
        vm.stopBroadcast();
        console2.log("receipt guid:");
        console2.logBytes32(receipt.guid);
    }

    function signMessage(
        address owner,
        uint256 signerPrivateKey,
        uint256 amount,
        address looser,
        address winner,
        uint256 points
    ) public returns (bytes memory signature) {
        vm.startPrank(owner);
        bytes32 msgHash = SignatureVerifier.getMessageHash(winner, looser, points, amount);
        bytes32 signedMsg = SignatureVerifier.getEthSignedMessageHash(msgHash);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, signedMsg);
        signature = abi.encodePacked(r, s, v); // note the order here is different from line above.
        vm.stopPrank();
    }
}

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.22;

import {SignatureVerifier} from "../src/libraries/SignatureVerifier.sol";

import {console2} from "forge-std/console2.sol";
import {Test} from "forge-std/Test.sol";
import {MockFlappy} from "../src/mock/MockFlappy.sol";

/// @notice Unit test for Flappy using the TestHelper.
/// @dev Inherits from TestHelper to utilize its setup and utility functions.
contract TestMocks is Test {
    address public p1 = address(0x123);
    address public p2 = address(0x456);
    uint256 signerPrivateKey = 0xabc123;
    address public owner;
    MockFlappy public flappy;
    address public endpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    function setUp() public {
        owner = vm.addr(signerPrivateKey);
        flappy = new MockFlappy(owner);
    }

    /// @notice test the signature signing.
    function test_signature() public {
        uint256 amount = 10;
        uint256 points = 10;
        bytes memory signature = signMessage(amount, p2, p1, points);
        console2.logBytes(signature);

        vm.prank(p1);
        bool isVerified = flappy.verifySignature(10, p2, points, signature);
        assertEq(isVerified, true);
    }

    function testReceiveMessage() public {
        bytes memory _payload = abi.encode(msg.sender, 10, 1);
        flappy._lzReceive(_payload);
    }

    function signMessage(uint256 amount, address looser, address winner, uint256 points)
        public
        returns (bytes memory signature)
    {
        vm.startPrank(owner);
        bytes32 msgHash = SignatureVerifier.getMessageHash(winner, looser, points, amount);
        bytes32 signedMsg = SignatureVerifier.getEthSignedMessageHash(msgHash);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, signedMsg);
        signature = abi.encodePacked(r, s, v); // note the order here is different from line above.
        vm.stopPrank();
    }
}

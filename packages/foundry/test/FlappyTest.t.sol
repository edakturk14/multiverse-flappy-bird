// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.22;

import {Packet} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ISendLib.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
// The unique path location of your OApp
import {Flappy} from "../src/Flappy.sol";
import {TestHelperOz5} from "@layerzerolabs/test-devtools-evm-foundry/contracts/TestHelperOz5.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SignatureVerifier} from "../src/libraries/SignatureVerifier.sol";

import {console2} from "forge-std/console2.sol";
import {Test} from "forge-std/Test.sol";
import {DeployCrossChain} from "../script/DeployCrossChain.s.sol";

contract ERC20Mock is ERC20 {
    constructor() ERC20("test", "TST") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

/// @notice Unit test for Flappy using the TestHelper.
/// @dev Inherits from TestHelper to utilize its setup and utility functions.
contract FlappyTest is Test {
    using OptionsBuilder for bytes;

    ERC20Mock public arbToken;
    ERC20Mock public baseToken;
    address p1 = address(0x123);
    address p2 = address(0x456);

    Flappy aFlappy; // OApp A
    Flappy bFlappy; // OApp B

    uint256 depositAmount = 100e18;

    modifier deposited() {
        vm.selectFork(arbitrumId);
        vm.prank(p1);
        aFlappy.deposit(depositAmount);

        vm.selectFork(baseId);
        vm.prank(p2);
        bFlappy.deposit(depositAmount);
        _;
    }
    /// @notice Calls setUp from TestHelper and initializes contract instances for testing.
    // todo make a new token, pass it in flayy constructor
    // give some token to the user

    uint256 public ownerPk;
    address public owner;
    uint256 public arbitrumId;
    uint256 public baseId;

    uint32 arbEid = uint32(40231);
    uint32 baseEid = uint32(40245);

    function setUp() public {
        // owner = vm.addr(ownerPk);

        DeployCrossChain deployCrossChain = new DeployCrossChain();
        (aFlappy, bFlappy, arbitrumId, baseId, owner, ownerPk) = deployCrossChain.run();

        // on arbitrum sepolia:
        vm.selectFork(arbitrumId);

        arbToken = new ERC20Mock();
        // Mint tokens to p1 and p2 and deal some eth on arb
        arbToken.mint(p1, 1000e18);
        arbToken.mint(p2, 1000e18);
        vm.deal(owner, 2 ether);
        vm.deal(p1, 2 ether);
        vm.deal(p2, 2 ether);

        //add erc20 token to flappy
        vm.prank(owner);
        aFlappy.addToken(arbToken);
        vm.prank(p1);
        arbToken.approve(address(aFlappy), type(uint256).max);

        // on base sepolia:
        vm.selectFork(baseId);
        baseToken = new ERC20Mock();
        // Mint tokens to p1 and p2 and deal some eth on base
        baseToken.mint(p1, 1000e18);
        baseToken.mint(p2, 1000e18);
        vm.deal(owner, 2 ether);
        vm.deal(p1, 2 ether);
        vm.deal(p2, 2 ether);

        //add erc20 token to flappy
        vm.prank(owner);
        bFlappy.addToken(baseToken);

        vm.prank(p2);
        baseToken.approve(address(bFlappy), type(uint256).max);
    }

    function testDeployment() public {
        vm.selectFork(arbitrumId);
        assertNotEq(address(aFlappy), address(0));
        assertNotEq(address(aFlappy.s_token()), address(0));
        assertEq(arbToken.balanceOf(p1), 1000e18);

        vm.selectFork(baseId);
        assertNotEq(address(bFlappy), address(0));
        assertNotEq(address(bFlappy.s_token()), address(0));
        assertEq(baseToken.balanceOf(p2), 1000e18);
    }

    function testDeposit() public deposited {
        vm.selectFork(arbitrumId);
        assertEq(aFlappy.s_amountWinByPlayer(p1), depositAmount);
        vm.selectFork(baseId);
        assertEq(bFlappy.s_amountWinByPlayer(p2), depositAmount);
    }

    function testClaimWin() public deposited {
        uint256 claimAmount = 10e18;
        vm.selectFork(arbitrumId);
        uint256 p1InitialBalance = arbToken.balanceOf(p1);
        vm.prank(p1);
        aFlappy.claimWin(claimAmount);
        assertEq(arbToken.balanceOf(p1), p1InitialBalance + claimAmount);
    }

    /// @notice Tests the send and multi-compose functionality of Flappy.
    /// @dev Simulates message passing from A -> B and checks for data integrity.
    function test_send() public deposited {
        uint256 amount = 10;
        uint256 points = 10;
        address winner = p1;
        address looser = p2;
        bytes memory signature = signMessage(amount, looser, winner, points);

        console2.logBytes(signature);

        vm.selectFork(arbitrumId);
        bytes memory _options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(150000, 0);
        vm.prank(winner);
        MessagingFee memory msgFee = aFlappy.quote(baseEid, amount, _options, false, points);

        vm.prank(winner);
        MessagingReceipt memory receipt =
            aFlappy.endGame{value: msgFee.nativeFee}(baseEid, amount, looser, points, signature, _options);
        assertEq(receipt.nonce, 1);
    }

    function signMessage(uint256 amount, address looser, address winner, uint256 points)
        public
        returns (bytes memory signature)
    {
        vm.startPrank(owner);
        bytes32 msgHash = SignatureVerifier.getMessageHash(winner, looser, points, amount);
        bytes32 signedMsg = SignatureVerifier.getEthSignedMessageHash(msgHash);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, signedMsg);
        signature = abi.encodePacked(r, s, v); // note the order here is different from line above.
        vm.stopPrank();
    }
}

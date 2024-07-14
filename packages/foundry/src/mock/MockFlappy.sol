// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions:

// Layout of Functions:
// constructor
// deposit()
// endGame()
// claimWin()

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

import {SignatureVerifier} from "../libraries/SignatureVerifier.sol";

/**
 * @notice This contract is needed for players to deposit tokens and claim their wins
 * @author fabriziogianni7
 */
contract MockFlappy {
    /*//////////////////////////////////////////////////////////////
                       ERRORS
    //////////////////////////////////////////////////////////////*/
    error Flappy__ProofNotValid();
    error Flappy__PeerAlreadyExists(bytes32);
    error Flappy__NotEnoughWin();

    using SafeERC20 for IERC20;
    using SignatureVerifier for bytes32;

    /*//////////////////////////////////////////////////////////////
                       STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    IERC20 public s_token;
    mapping(address => uint256) public s_amountWinByPlayer;
    uint32 public s_eidCounter;
    address public owner;

    /*//////////////////////////////////////////////////////////////
                             EVENTS   
    //////////////////////////////////////////////////////////////*/
    event Deposited(address indexed player, uint256 indexed amount);
    event GameEnded(address indexed winner, address indexed looser, uint256 indexed amount);
    event WinClaimed(address indexed winner, uint256 indexed amount);
    event TokenSet();

    /*//////////////////////////////////////////////////////////////
                         FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice set the token accepted
     * the owner is also the address in our resolver (for now)
     */
    constructor(address _owner) {
        owner = _owner;
    }

    /*//////////////////////////////////////////////////////////////
                           APP LOGIC
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice allow users to deposit tokens before starting the game
     * @dev increase  s_amountWinByPlayer
     * @param amount the amount to deposit
     * @custom:emit Deposited
     */
    function deposit(uint256 amount) external {
        s_amountWinByPlayer[msg.sender] += amount;
        s_token.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                           PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Verifies the signature provided by the back end
     *  @dev the winner call this, this method will check that the winner actually won the match
     *  @param amount The amount encoded in the message
     *  @param signature The signature of the message
     *  @return bool Returns true if the signature is valid, false otherwise
     */
    function verifySignature(uint256 amount, address looser, uint256 points, bytes memory signature)
        public
        view
        returns (bool)
    {
        return SignatureVerifier.verify(owner, msg.sender, amount, looser, points, signature);
    }

    /*//////////////////////////////////////////////////////////////
                           LAYER ZERO
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice  Internal function override to handle incoming messages from another chain.
     * @dev increase s_amountWinByPlayer
     * @custom:lzero _origin A struct containing information about the message sender.
     * @custom:lzero _guid A unique global packet identifier for the message.
     * @param payload The encoded message payload being received.
     *
     * @custom:lzero The following params are unused in the current implementation of the OApp.
     * @custom:lzero _executor The address of the Executor responsible for processing the message.
     * @custom:lzero _extraData Arbitrary data appended by the Executor to the message.
     *
     * Decodes the received payload and processes it as per the business logic defined in the function.
     */
    function _lzReceive(bytes memory payload) public {
        (address winner, uint256 amount) = abi.decode(payload, (address, uint256));
        // s_amountWinByPlayer[winner] += amount;
    }

    /**
     * @notice set the accepted token
     *  @dev need to call this after contract deploy
     * @custom:emit TokenSet()
     *  @param _token the token address
     */
    function addToken(IERC20 _token) public {
        s_token = _token;
        emit TokenSet();
    }
}

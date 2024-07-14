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

import {SignatureVerifier} from "./libraries/SignatureVerifier.sol";

/**
 * @notice This contract is needed for players to deposit tokens and claim their wins
 * @author fabriziogianni7
 */
contract Flappy is OApp {
    /*//////////////////////////////////////////////////////////////
                       ERRORS
    //////////////////////////////////////////////////////////////*/
    error Flappy__ProofNotValid();
    error Flappy__PeerAlreadyExists(bytes32);
    error Flappy__NotEnoughWin();

    /*//////////////////////////////////////////////////////////////
                       LIBRARIES
    //////////////////////////////////////////////////////////////*/
    using SafeERC20 for IERC20;
    using SignatureVerifier for bytes32;
    using OptionsBuilder for bytes;

    /*//////////////////////////////////////////////////////////////
                       STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    IERC20 public s_token;
    mapping(address => uint256) public s_amountWinByPlayer;
    mapping(address => uint256) public s_pointsByPlayer;
    uint32 public s_eidCounter;

    /*//////////////////////////////////////////////////////////////
                             EVENTS   
    //////////////////////////////////////////////////////////////*/
    event Deposited(address indexed player, uint256 indexed amount);
    event GameEnded(address indexed winner, address indexed looser, uint256 indexed amount, uint256 points);
    event WinClaimed(address indexed winner, uint256 indexed amount);
    event TokenSet();

    /*//////////////////////////////////////////////////////////////
                         FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice set the token accepted
     * the owner is also the address in our resolver (for now)
     */
    constructor(address _endpoint, address _delegate) OApp(_endpoint, _delegate) Ownable(_delegate) {}

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

    /**
     * @notice when the game is over, send a messsage crosschain to allow the winner to claim the win
     *     GAME OVER -> output a winner and a looser ->
     *     THE Winner submit here the proof
     *     THE CONtract verify that the owner of the contract signed the proof
     *     all the other things
     * @dev this function send a message cross chain
     * @dev this method is called by the winner on the winner chain
     * @dev decrease  s_amountWinByPlayer for looser on this chain
     * @dev increase  s_amountWinByPlayer for winner on other chain
     *  @custom:emit GameEnded(winner,looser,amount)
     */
    function endGame(
        uint32 eid,
        uint256 amount,
        address looser,
        uint256 points,
        bytes memory proof,
        bytes memory /*_options*/
    ) external payable returns (MessagingReceipt memory receipt) {
        bool isProofValid = verifySignature(amount, looser, points, proof);
        if (!isProofValid) {
            revert Flappy__ProofNotValid();
        }
        s_pointsByPlayer[msg.sender] += points;

        //  send msg crosschain with layer0
        bytes memory _options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(150000, 0); //setting a default value for sending test txs
        bytes memory _payload = abi.encode(msg.sender, amount, points);

        receipt = _lzSend(eid, _payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));

        emit GameEnded(msg.sender, looser, amount, points);
    }

    /**
     * @notice check the s_amountWinByPlayer, if enough, send the amount to the user and decrease s_amountWinByPlayer
     */
    function claimWin(uint256 amount) external {
        if (s_amountWinByPlayer[msg.sender] < amount) {
            revert Flappy__NotEnoughWin();
        }
        s_amountWinByPlayer[msg.sender] -= amount;
        s_token.safeTransfer(msg.sender, amount);
        emit WinClaimed(msg.sender, amount);
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
        address owner = owner();
        return SignatureVerifier.verify(owner, msg.sender, amount, looser, points, signature);
    }

    /*//////////////////////////////////////////////////////////////
                           LAYER ZERO
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Quotes the gas needed to pay for the full omnichain transaction in native gas or ZRO token.
     * @param _dstEid Destination chain's endpoint ID. default will be 0 here
     * @param _amount The message.
     * @param _options Message execution options (e.g., for sending gas to destination).
     * @param _payInLzToken Whether to return fee in ZRO token.
     * @return fee A `MessagingFee` struct containing the calculated gas fee in either the native token or ZRO token.
     */
    function quote(uint32 _dstEid, uint256 _amount, bytes memory _options, bool _payInLzToken, uint256 points)
        public
        view
        returns (MessagingFee memory fee)
    {
        bytes memory _payload = abi.encode(msg.sender, _amount, points);
        fee = _quote(_dstEid, _payload, _options, _payInLzToken);
    }

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
    function _lzReceive(
        Origin calldata, /*_origin*/
        bytes32, /*_guid*/
        bytes calldata payload,
        address, /*_executor*/
        bytes calldata /*_extraData*/
    ) internal override {
        (address looser, uint256 amount,) = abi.decode(payload, (address, uint256, uint256));
        s_amountWinByPlayer[looser] -= amount;
    }

    /**
     * @notice set the accepted token
     *  @dev need to call this after contract deploy
     * @custom:emit TokenSet()
     *  @param _token the token address
     */
    function addToken(IERC20 _token) public onlyOwner {
        s_token = _token;
        emit TokenSet();
    }
}

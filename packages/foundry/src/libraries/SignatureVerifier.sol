// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SignatureVerifier {
    function getMessageHash(address _msgSender, address _looser, uint256 _points, uint256 _amount)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_msgSender, _amount, _points, _looser));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function verify(
        address _signer,
        address _msgSender,
        uint256 _amount,
        address _looser,
        uint256 points,
        bytes memory _signature
    ) internal pure returns (bool) {
        bytes32 messageHash = getMessageHash(_msgSender, _looser, points, _amount);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, _signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}

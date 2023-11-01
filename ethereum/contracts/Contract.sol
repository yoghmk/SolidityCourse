// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    address payable lWallet;
    address payable tWallet;
    uint256 public treFee = 6;
    uint256 public liqFee = 4;

    mapping(string => bool) ElementExists;
    string [] public Elements;


    constructor(address payable _liquidityWallet, address payable _treasuryWallet) ERC721("Example", "EXM") {
        lWallet = _liquidityWallet;
        tWallet = _treasuryWallet;
    }

    function mint(address _to, string memory _imgCid) public payable {
        require(msg.value > 0, "Value degeri 0 dan buyuk olmalidir");
        require(!ElementExists[_imgCid],
                'Error - Bu element zaten mevcut');

        mintElements.push(_imgCid);
        uint tokenId = Elements.length - 1;

        uint256 treAmount = msg.value * treFee / 100;
        uint256 liqAmount = msg.value * liqFee / 100;

        liquidityWallet.transfer(liqAmount);
        treasuryWallet.transfer(treAmount);

        _safeMint(_to, tokenId);

        ElementExists[_imgCid] = true;
    }
}

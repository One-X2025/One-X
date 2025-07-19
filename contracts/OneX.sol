// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OneX is ERC20Capped, Ownable {
    constructor() ERC20("OneX", "ONE") ERC20Capped(20000000 * 10 ** decimals()) {
        _mint(msg.sender, cap());
    }
}

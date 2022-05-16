// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/metatx/ERC2771Context.sol';
import '@openzeppelin/contracts/metatx/MinimalForwarder.sol';

contract ETBCOIN is ERC2771Context,ERC20 {  

  constructor(string memory name,string memory symbol,MinimalForwarder forwarder) // Initialize trusted forwarder
    ERC2771Context(address(forwarder)) ERC20(name,symbol) {
    _mint(msg.sender, 1000000*10**6);
  }

  function _msgSender() internal view virtual override(Context,ERC2771Context) returns(address){
   return ERC2771Context._msgSender();
  }
 function _msgData() internal view virtual override(Context,ERC2771Context)returns(bytes calldata){
    return ERC2771Context._msgData();
  }
  
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/metatx/ERC2771Context.sol';
import '@openzeppelin/contracts/metatx/MinimalForwarder.sol';

contract ETBCOIN is ERC2771Context,ERC20,ERC20Burnable, Pausable, AccessControl {  


    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


  constructor(string memory name,string memory symbol,MinimalForwarder forwarder) // Initialize trusted forwarder
    ERC2771Context(address(forwarder)) ERC20(name,symbol) {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
      _mint(msg.sender, 1000000*10**6);
  }

  

   function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns(uint8) {
      return 6;
    }


  function _msgSender() internal view virtual override(Context,ERC2771Context) returns(address){
   return ERC2771Context._msgSender();
  }
 function _msgData() internal view virtual override(Context,ERC2771Context)returns(bytes calldata){
    return ERC2771Context._msgData();
  }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
  
}
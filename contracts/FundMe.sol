// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.0;

// constant , immutable
// Error Code
error FundMe__NotOwner();

// Libraries / Interfaces / Contracts
import "./PriceConvertor.sol";

/** @title A contract for collecting fund
 * @author Yana Gupta
 * @notice
 * @dev
 */

contract FundMe {
  // Type Declaration
  using utils for uint256;

  uint256 public constant MINIMUMUSD = 1;
  address[] public getFunder;
  mapping(address => uint256) public getAddressToAmmount;
  address public immutable i_owner;
  AggregatorV3Interface public getPriceFeed;

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    getPriceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  function fund() public payable {
    require(
      msg.value > MINIMUMUSD.getConversionRate(getPriceFeed),
      "DIDN'T SEND ENOUGH."
    );
    getFunder.push(msg.sender);
    getAddressToAmmount[msg.sender] = msg.value;
  }

  function withdraw() public onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < getFunder.length;
      funderIndex++
    ) {
      address funder = getFunder[funderIndex];
      getAddressToAmmount[funder] = 0;
    }
    getFunder = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");

    require(callSuccess, "Call Failed");
  }

  // Making cheaper withdraw function
  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = getFunder;
    // mapping cannor be stored in memory
    for (
      uint256 funderIndex = 0;
      funderIndex < funders.length;
      funderIndex++
    ) {
      address funder = funders[funderIndex];
      getAddressToAmmount[funder] = 0;
    }

    getFunder = new address[](0);
    (bool success, ) = i_owner.call{value: address(this).balance}("");
    require(success);
  } 

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    _;
  }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library utils { 
    function ethToUSD(
        AggregatorV3Interface PriceFeed
    ) internal view returns (uint256) {
        (, int256 price, , , ) = PriceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 dollarAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        return ((dollarAmount * 1e36) / ethToUSD(priceFeed));
    }
}

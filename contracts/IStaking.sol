// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStaking {
    function stake(uint256 amount) external returns (bool);
    function stakeFor(address user, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

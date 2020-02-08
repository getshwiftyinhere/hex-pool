pragma solidity 0.5.13;

import "./IERC20.sol";

contract HEX is IERC20HEX{
   function stakeStart(uint256 newStakedHearts, uint256 newStakedDays) external;
   function stakeEnd(uint256 stakeIndex, uint40 stakeIdParam) external;
   function stakeCount(address stakerAddr) external view returns (uint256);
   function stakeLists(address owner, uint256 stakeIndex) external view returns (uint40, uint72, uint72, uint16, uint16, uint16, bool);
   function currentDay() external view returns (uint256);
   function dailyDataRange(uint256 beginDay, uint256 endDay) external view returns (uint256[] memory);
   function globalInfo() external view returns (uint256[13] memory);
}

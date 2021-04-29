/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    let map = new Map();
    for (let i in nums) {
        map.set(nums[i], i);
    }
    // for (let [key, value] of map) { twoSum([3,3], 6)
    //     if (map.has(target - key) && map.get(target - key) !== value) {
    //         return [value, map.get(target - key)];
    //     }
    // }
    for (let j in nums) {
        if (map.has(target - nums[j]) && map.get(target - nums[j]) !== j) {
            return [j, map.get(target - nums[j])];
        }        
    }
    return false;
};
// @lc code=end


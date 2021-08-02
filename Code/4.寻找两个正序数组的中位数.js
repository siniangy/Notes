/*
 * @lc app=leetcode.cn id=4 lang=javascript
 *
 * [4] 寻找两个正序数组的中位数
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    let nums3 = nums1.concat(nums2).sort((a, b) => { return a - b });
    if (nums3.length === 0) return 0;
    if (nums3.length % 2 === 0) {
        return (nums3[nums3.length / 2] + nums3[nums3.length / 2 - 1]) / 2;
    } else {
        return nums3[Math.floor(nums3.length / 2)]
    }
};
console.log(findMedianSortedArrays([-2, -1], [3]))
// @lc code=end


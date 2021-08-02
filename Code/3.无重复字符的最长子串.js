/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let max = 0, arr = [];
    for (let i = 0; i < s.length; i++) {
        let index = arr.indexOf(s[i]);
        if (index !== -1) {
            arr.splice(0, index + 1); // 碰到重复的值删除到重复值所处的位置 如abcb -> cb
        }
        arr.push(s.charAt(i)); // arr缓存值
        max = Math.max(max, arr.length);
    }
    return max;
};
// @lc code=end


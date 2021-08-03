/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
// 暴力解法不可取
var longestPalindrome = function (s) {
    let max = 0, tempArr = [], tempStr = "";
    for (let i = 0; i < s.length; i++) {
        for (let j = s.length; j > i; j--) {
            tempArr.push(s[i] + s.substring(i + 1, j))
        }
    }
    for (let item of tempArr) { 
        if (item.split('').reverse().join('') === item) {
            tempStr = item.length > max ? item : tempStr;
            max = Math.max(item.length, max);
        }
    }
    return tempStr;
};
// 
// @lc code=end


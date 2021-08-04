/*
 * @lc app=leetcode.cn id=9 lang=javascript
 *
 * [9] 回文数
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
    // 字符串
    // return x.toString().split('').reverse().join('') === x.toString()
    
    // 往中间遍历
    let tempStr = x.toString();
    let left = 0, right = tempStr.length - 1;
    while (left < right) {
        if (tempStr[left] !== tempStr[right]) return false;
        left++;
        right--;
    }
    return true;
};
// @lc code=end


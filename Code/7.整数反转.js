/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var testNumber = (num) => {
    return (num >= Math.pow(2, 31) - 1 || num <= Math.pow(-2, 31)) ? 0 : num;
}
var reverse = function (x) {
    let tempStr = x.toString();
    let flag = tempStr[0] === '-';
    let reverseStr = ''
    if (flag) {
        reverseStr = tempStr.slice(1).split('').reverse().join('')
    } else {
        reverseStr = tempStr.split('').reverse().join('')
    }
    return flag ? testNumber(-1 * Number(reverseStr)) : testNumber(Number(reverseStr));
};
// console.log(reverse(-123));
// @lc code=end


/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
var addTwoNumbers = function (l1, l2) {
    let temp1 = [], temp2 = [], temp3 = [];
    while (l1 !== null || l2 !== null) {
        temp1.push(l1 !== null ? l1.val : 0);
        temp2.push(l2 !== null ? l2.val : 0);
        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }
    temp1 = temp1.reverse();
    temp2 = temp2.reverse();
    for (let i = 0; i < temp1.length; i++) {
        temp3.push(temp1[i] + temp2[i]);
    }
    for (let j = temp3.length - 1; j > 0; j--) {
        if (temp3[j] >= 10) {
            temp3[j] = temp3[j] % 10;
            temp3[j - 1] += 1;
        }
    }
    if (temp3[0] >= 10) {
        temp3[0] = temp3[0] % 10;
        temp3.unshift(1);
    }
    let l3 = new ListNode(-1);
    let node = l3;
    let res = temp3.reverse();
    for (let k = 0; k < res.length; k++) {
        node.next = new ListNode(res[k]);
        node = node.next;
    }
    return l3.next;
};
// let ex1 = new ListNode(5, new ListNode(4, new ListNode(4)));
// let ex2 = new ListNode(5, new ListNode(6, new ListNode(5)));
// console.log(addTwoNumbers(ex1, ex2));
// @lc code=end


### 1、作用域是什么

- LHS查询和RHS查询

编译包括三个步骤，词法分析、语法分析、代码生成

当变量出现在赋值操作的左侧时进行LHS查询，出现在右侧时进行RHS查询，赋值的话是LHS查询，其余是RHS查询
```javascript
/**
 * JIT 即时编译
 * LHS查询和RHS查询的区别是如果查找的目标是对变量进行赋值即为LHS查询，如果目的是获取变量的值即为RHS查询
 * 不成功的RHS引用会导致抛出ReferenceError异常；不成功的LHS引用会导致自动隐式地创建一个全局变量（非严格模式下）
 */
function foo(a) {
    var b = a;
    return a+b;
}
var c = foo(2);// 包含LHS查询的操作有 c=  b=  a的隐式赋值   包含RHS查询的操作有 foo(a)  =a  a+  +b
```

---

### 2、词法作用域

- 欺骗词法

无论函数在哪里被调用， 也无论它如何被调用， 它的词法作用域都只由函数被声明时所处的位置决定

JavaScript引擎会在编译阶段进行数项的性能优化，其中有些优化依赖于能够根据代码的词法进行静态分析， 并预先确定所有变量和函数的定义位置， 才能在执行过程中快速找到标识符。使用欺骗词法导致编译阶段所做的词法性能优化可能没有意义。

1. eval可以接收一个字符串作为参数，修改所处词法作用域
```javascript
function foo(str, a) {
  eval(str);
  console.log(a, b);
}
foo('var b = 100',1); // 1 100 ('use strict'模式下会报错)
console.log(b); // b is not defined
```

2. with块，创建一个新的词法作用域
```javascript
function foo(obj) {
  with (obj) {
    a = 2;
  }
}
var o1 = { 'a': 3 };
var o2 = { 'b': 3 };
foo(o1);
console.log(o1.a); // 2
foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2——不好，a被泄漏到全局作用域上了！
```

---

### 3、函数作用域和块作用域

- 函数是最常见的作用域单元，但函数不是唯一的作用域单元。块作用域指的是变量和函数不仅可以属于所处的作用域，也可以属于某个代码块（用{}包裹）

一篇解释作用域的文章： https://blog.csdn.net/weixin_40387601/article/details/80515665
```javascript
/**
 * 隐藏函数内部实现符合良好的程序设计原理，规避命名冲突
 * 始终给函数命名是一个最佳实践，递归引用自身
 * IIFE（立即执行函数表达式）(function() {...})()
 */
 
/**
 * with从对象中创建出的作用域仅在with声明中而非外部作用于中有效
 * try-catch同样也创建了一个块状作用域
 * let进行的声明不会在块作用域中提升
 */
```

- 思考一个块级作用域最简单的例子

为什么要把一个只在for循环内部使用（至少应该是只在内部使用的）变量i污染到整个函数作用域中呢。let的引入很有必要
```javascript
for (let i = 0; i < 10; i++) {
  console.log(i); // 0,1,2,3...
}
console.log(i); // ReferenceError
```

---

### 4、提升

- 提升是指声明的提升

先有声明后有赋值，var a = 2包括var a和a = 2，前者是编译阶段的任务，声明会被提升，后者是执行阶段的任务，赋值操作会留在原地
```javascript
/**
 * 变量声明提升和函数声明提升
 * 函数声明优先级大于变量声明，重复声明会被忽略
 * 函数声明会提升，函数表达式不会被提升
 */
foo(); // TypeError: foo is not a function，这里的foo是undefined，存在变量声明提升
var foo = function bar() {
  // ...
};
```

---

### 5、作用域闭包

- 闭包依赖于函数

闭包是基于词法作用域书写代码所产生的的自然结果

闭包指的是能够访问自由变量（在函数中使用，既不是函数参数也不是函数局部变量的变量）的函数 。理论意义上所有的函数都是闭包（函数中使用的全局变量也是自由变量）；实践意义上的闭包即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）；在代码中引用了自由变量。本书中的闭包期待函数在本身的词法作用域之外执行
```javascript
// 举个例子1
function foo() {
  var a = 2;
  function baz() {
    console.log(a); // a就是一个自由变量
  } 
  return baz;
}
var baz = foo();
// 在foo() 执行后，通常会期待foo() 的整个内部作用域都被销毁，因为我们知道引擎有垃圾回收器用来释放不再使用的内存空间。由于看上去foo() 的内容不会再被使用，所以很自然地会考虑对其进行回收
// 而闭包的“神奇”之处正是可以阻止这件事情的发生。事实上内部作用域依然存在，因此没有被回收。谁在使用这个内部作用域？原来是bar() 本身在使用。
baz(); // 2

// 举个例子2
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  bar(baz);
}
function bar(fn) {
  fn();
}
foo(); // 2

// 举个例子3
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000);
}
wait('Hello, closure');
// wait函数执行1000ms后，理论上被垃圾回收的的wait函数的内部作用域并没有消失，timer函数仍然可以访问到message
```

- 用循环来解释闭包
```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
} // 每秒一次输出5个6，6是全局的i，延迟函数的回调会在循环结束后执行

for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
} // IIFE为每一个迭代生成一个新的块作用域，每秒输出1-5

for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
} // for循环头部的let声明会封装一个块级作用域，每秒输出1-5
```

- 在模块中使用闭包

模块模式需要具备两个必要条件
1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态
```javascript
function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];
  function doSomething() {
    console.log(something);
  }
  function doAnother() {
    console.log(another.join(" ! "));
  }
  return {
    doSomething: doSomething,
    doAnother: doAnother
  };
}
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

- 使用闭包封装模块的一个例子
```javascript
// 定义模块
var MyModules = (function Manager() {
  var modules = {};
  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps); // impl指定this值，deps数组传参进去
  }
  function get(name) {
    return modules[name];
  }
  return {
    define: define,
    get: get
  };
})();
// 模块的使用
MyModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }
  return {
    hello: hello
  };
});
MyModules.define("foo", ["bar"], function (bar) {
  var hungry = "hippo";
  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }
  return {
    awesome: awesome
  };
});
var bar = MyModules.get("bar");
var foo = MyModules.get("foo");
console.log(bar.hello("hippo")); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO
```

---
 
### 附录A 动态作用域

无论函数在哪里调用，也无论它被如何调用，它的词法作用域只由函数被声明时所处的位置决定，而动态作用域是在运行时确定的，换句话说，动态作用域作用域链是基于调用栈的，而不是代码中的作用域嵌套。<span style="color:lightpink">这里需要尤其注意，this的运行机制类似动态作用域</span>
```javascript
/** 
 * 动态作用域的作用域链是基于调用栈的，而不是代码中的作用域嵌套
 * 代码例子如下，需要明确的是，JavaScript只有词法作用域，而词法作用域由函数被声明所处位置决定
 */
function foo() {
  console.log(a); // 动态作用域会输出3（不是2 ！）
}
function bar() {
  var a = 3;
  foo();
}
var a = 2;
bar();
```

---
 
### 附录B 块级作用域的替代方案
```javascript
/** 
 * 块级作用域的替代方案，try-catch？
 * 代码例子如下
 */
{
  let a = 2;
  console.log(a); // 2
}
console.log(a); // ReferenceError: a is not defined

try { throw 2; } catch (a) {
  console.log(a); // 2
}
console.log(a); // ReferenceError: a is not defined
```

---


### 附录C this语法

• 箭头函数放弃了所有普通this绑定的规则（this绑定类似动态作用域），取而代之的是用当前的词法作用域覆盖了本应该变化的this的值
```javascript
var obj = {
  id: 'awesome',
  cool: function coolFn() {
    setTimeout(function timer() {
      console.log(this.id);
    }, 100);
  }
};
var id = 'not awesome';
obj.cool(); // chrome下会打印 not awesome

var obj = {
  count: 0,
  cool: function coolFn() {
    var self = this;
    if (self.count < 1) {
      setTimeout(function timer() {
        self.count++;
        console.log(self);
      }, 100);
    }
  }
};
obj.cool(); // { count: 1, cool: [Function: coolFn] }
```

• 箭头函数的使用，不只是减少代码的书写
```javascript
var obj = {
  count: 0,
  cool: function coolFn() {
    if (this.count < 1) {
      // t1,this箭头函数,this的作用域是obj
      setTimeout(() => { 
        this.count++;
        console.log("awesome?");
      }, 100); 
      // t2，bind的使用
      setTimeout(function timer() {
        this.count++;
        console.log("awesome?");
      }.bind(this), 100)
    }
  }
};
obj.cool(); // awesome?
```

### 1、关于this

- this提供了一种较显式传递上下文对象更为优雅的方式来隐式传递一个对象引用

- 一个直接例子 this既不指向函数自身也不指向函数的词法作用域
```javascript
function foo() {
  var a = 2;
  this.bar();
}
function bar() {
  console.log(this.a);
}
foo(); // ReferenceError: a is not defined 
```
---

### 2、this全面解析

- 举个例子看下什么是调用栈和调用位置
```javascript
function baz() {
  bar(); // 当前调用栈是baz -> bar 当前调用位置在baz中
}
function bar() {
  foo(); // 当前调用栈是baz -> bar -> foo 当前调用位置在bar中
}
function foo() {
  console.log('foo');
}
baz(); // 当前调用栈是：baz 当前调用位置是全局作用域
```

- this的绑定规则

this是在运行时绑定，它的上下文取决于函数调用时的各种条件，this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。this的绑定规则有四种

1. 默认绑定，绑定到全局作用域
```javascript
// 独立函数调用，引用默认绑定，this指向全局对象
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 非严格模式下输出2，严格模式或node环境下打印undefined
```

2. 隐式绑定，会产生隐式丢失，导致函数会使用默认绑定，不靠谱
```javascript
// 隐式绑定的例子
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 2

// 回调函数导致隐式丢失
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  fn(); // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"，node下打印undefined

// setTimeout导致隐式丢失
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
}
var a = '2';
obj.foo(); // 2
setTimeout(obj.foo,100); // '2',严格模式或node环境下打印undefined
```

3. 显式绑定，使用call或apply指定this的绑定对象
```javascript
function foo(args) {
  console.log(this.a, args);
  return this.a + args;
}
var obj = {
  a: 2
}
var bar = function () { // 等同于var bar = foo.bind(obj)
  return foo.apply(obj, arguments); // 硬绑定，注意传入的是arguments
}
var b = bar(3); // 2 3
console.log(b);// 5

// 使用bind
function foo(args) {
  console.log(this.a, args);
  return this.a + args;
}
var obj = {
  a: 2
}
function bind(fn, obj) {
  return function() {
    console.log(arguments); // [Arguments] { '0': 3 }
    return fn.apply(obj, arguments);
  }
}
var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b);// 5
```

4. new绑定 实际上并不存在构造函数 只有函数的构造调用
```javascript
/** 使用new来发生构造函数调用时
  1、创建一个全新的对象
  2、新对象会执行原型链连接
  3、新对象会绑定到函数调用的this
  4、如果函数没有其它返回对象，new函数调用会自动返回这个新对象
*/
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

- 绑定优先级

1. 比较隐式绑定和显式绑定 显式绑定 > 隐式绑定
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 3,
  foo: foo
}
obj.foo(); // 2
obj.foo.call(obj2); // 3
```

2. 比较new绑定和隐式绑定 new绑定 > 隐式绑定
```javascript
function foo(args) {
  this.a = args;
}
var obj1 = { foo: foo };
var obj2 = {};
obj1.foo(2);
console.log(obj1); // { foo: [Function: foo], a: 2 }

var bar = new obj1.foo(4);
console.log(obj.a); // 2
console.log(bar.a); // 4
```

3. 比较new绑定和显式绑定 new创建的this会替换硬绑定的this
```javascript
function foo(args) {
  this.a = args;
}
var obj1 = {};
var bar = foo.bind(obj1);
bar(2);
console.log(bar); // [Function: bound foo]
console.log(obj1); // { a: 2 }

var baz = new bar(3);
console.log(obj1); // { a: 2 }
console.log(baz); // foo { a: 3 }
```

- this的绑定意外

1. 显式绑定中传入null或者undefined，会执行默认绑定 在不关心this指向的时候使用
```javascript
// 这里使用Object.create(null)避免this的意外错误
function foo(a, b) {
  console.log('a:' + a + '  b:' + b);
}
var ø = Object.create(null);
foo.apply(ø, [2, 3]); // a:2  b:3
var bar = foo.bind(ø, 2);
bar(3);// a:2  b:3
```

2. 间接引用
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
var o = { a: 2, foo: foo };
var p = { a: 4 };
o.foo(); // 2
(p.foo = o.foo)(); // node环境下打印undefined
```

3. 软绑定 解决硬绑定不会修改this的问题
```javascript
function foo() {
  console.log(this.a);
}
var obj1 = {a:2};
var obj2 = {a:3};
var bar = foo.bind(obj1);
var baz = bar.bind(obj2);
bar(); // 2
baz(); // 2，而不是3，硬绑定不会再修改this
// 软绑定，写法待研究
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this;
    var curried = [].slice.call(arguments, 1);
    var bound = function () {
      return fn.apply(
        (!this || this === (global)) ?
          obj : this,
        curried.concat.apply(curried, arguments)
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  }
}
function foo() {
  console.log(this.a);
}
var obj1 = { a: 2 };
var obj2 = { a: 3 };
var bar = foo.softBind(obj1);
bar(); // 2
var baz = bar.softBind(obj2);
baz(); // 3
```

- ES6中的箭头函数

箭头函数不适用于this绑定的4种原则，而是根据外层作用域来决定this。箭头函数的this绑定无法被修改，效果类似硬绑定bind
```javascript
function foo() {
  setTimeout(() => {
    console.log(this.a);
  }, 100);
}
var bar = foo.bind({ a: 2 });
bar(); // 2
bar.call({ a: 3 }); // 2
```

---

### 3、对象
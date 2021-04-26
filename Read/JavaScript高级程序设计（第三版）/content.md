### 1、JavaScript实现

• 一个完整的JavaScript实现应该由三个不同的部分组成，核心ECMAScript、文档对象模型DOM、浏览器对象模型BOM

• DOM1级主要目标是映射文档的结构；DOM2级引入了新的模块，也给出了众多新类型和新借口的定义，DOM视图、DOM事件、DOM样式、DOM遍历和范围；DOM3级则进一步扩展了DOM，引入了以同一方式加载和保存文档的方法、新增了验证文档的方法、使得DOM核心支持XML1.0规范等

• BOM浏览器对象模型从根本上只处理浏览器窗口和框架，但很多针对浏览器的JavaScript扩展也算作BOM的一部分，比如弹出新浏览器窗口的功能、移动缩放和关闭浏览器窗口的功能、提供浏览器详细信息的navigator对象、提供浏览器加载页面的详细信息的location对象、提供用户显示器分辨率详细信息的screen对象、对cookies的支持以及XMLHttpRequest等这样的自定义对象

--- 

### 2、在HTML中使用JavaScript

• script标签包含的defer属性、async属性、charset属性、language(已废弃)、src属性和type属性

• noscript标签平稳退化

---

### 3、基本概念

本章是基于第三版定义的ECMAScript介绍这门语言的基本特性，现在都要ES不知道几了

• 也许不小心就创建了一个全局变量
```javascript
function say() {
    a = 'hi'; // 省略了 var 操作符
}
say();
alert(a);
```

• JavaScript中的数据类型
```javascript
// null == undefined => true        null === undefined => false
// 假值包括 0 null '' undefined NaN false
// 二进制浮点数不准确，浮点数值的最高精度是17位小数，比如0.1+0.2不等于0.3 可以使用Number.EPSILON做精度判断
// isNaN()函数接受参数，任何不能转换为数值的值会返回true
isNaN('11'); // false
isNaN('rrr'); // true
isNaN(NaN); // true
// 把非数值转换为数值的函数包括Number() parseInt() parseFloat()，里面的规则比较复杂，parseInt和parseFloat只处理字符串
Number('hi'); // NaN
parseInt('AF',16); // 16进制解析，返回175
parseFloat('22.34.5'); // 22.34 第一个小数点是有效的 需要注意的parseFloat函数只解析10进制的数
// 数值、布尔值、对象和字符串都有一个toSting()方法，但null值和undefined值没有这个方法
var num = 10;
num.toString(); // '10'
num.toString(2); // '1010' 二进制
```

• JavaScript中的操作符（类型转换看你不知道的JavaScript中卷）
```javascript
// 一元操作符
var a = false;var b = a++;b; // 0
var a = false;var b = ++a;b; // 1
var o = {
    valueOf: function() {
    return -1;
  }
}
o--; // -2
// 位操作符（）,位操作相关会单独写一篇文章，使用位操作符会提升运算效率
/* 逻辑与和逻辑或都是短路运算符 因此返回值符合下面的规律
 * ||结果为true，返回第一个为真的值 
 * ||结果为false，返回第二个为假的值
 * &&结果为true，返回第二个为真的值
 * &&结果为false，返回第一个为假的值
 */
var found = false;
var result = found && someThingUndefined;result; // 输出为false，&&为短路运算符
var found = true;
var result = found || someThingUndefined;result; // 输出为true，||为短路运算符
// 0/0 返回NaN
// == 和 ===的区别在于前者存在类型转换
```

• JavaScript中的语句
```javascript
// for-in遍历数组下标 for-of遍历数组的值
// label语句 有点类似go-to
start: for (var i = 0; i < 10; i++) {
  alert(i); // 可搭配break或continue语句使用
}
// switch 多个else if时用switch可读性高
var i = 25;
switch (i) {
  case 25:
  case 35:
    console.log('i is 25 or 35'); // 输出 i is 25 or 35
    break;
  case 45:
    console.log('i is 45');
    break;
  default:
    console.log('others');
}
```

• JavaScript中的函数
```javascript
// arguments 类数组对象
// JavaScript中没有传统意义上的函数重载（但是可以通过arguments对象判断传参类型和数量的不同做不同的反应，模仿重载）
function doAdd() {
    if (arguments.length === 1) {
    return arguments[0] + 10;
  } else if (arguments.length === 2) {
    return arguments[0] + arguments[1];
  }
}
doAdd(10); // 20
doAdd(10,30); // 40
// 同样的命名后面的函数会覆盖前面的
function addNumber(num1) {
  return num1 + 100;
}
function addNumber(num1) {
  return num1 + 200;
}
console.log(addNumber(100)); // 300
```

---

### 4、变量、作用域和内存问题

• 基本类型值是按值访问的，因此可以可以操作保存在变量中实际的值，栈访问；而引用类型的值是保存在内存中的对象，是按引用访问的，堆访问（这里注意，当复制保存着对象的某个变量时，操作的是对象的引用，但是为对象添加属性时，操作的是实际的对象）
```javascript
var obj1 = new Object();
var obj2 = obj1;
obj1.name = '小黄鸡';
console.log(obj2.name); // '小黄鸡'
```

• JavaScript中函数参数是按值传递的，什么是按值传递，效果与变量拷贝一致
```javascript
function changeName(o) {
  o.name = 'sn';
  return o;
}
var person = new Object();
var res = changeName(person);
cb(res); // { name: 'sn' } 
cb(person); // { name: 'sn' } 函数外部的person也改变了，这是否说明引用类型是按引用传递的呢？ 具体解释见JavaScript深入系列第九节
```

• 全局执行环境的变量对象始终都是作用域链的最后一个对象，延长作用域链的两个方法，catch块和with语句，这两个语句都会在作用域的前端添加一个变量对象

• JavaScript具有自动垃圾收集功能，具体到浏览器中而言有两个策略，最常用的垃圾收集方式是标记清除，标记一个变量何时进入环境何时离开环境，另一种不太使用的方式是引用计数，引用计数为0，内存空间就会被释放，循环引用会导致引用计数失效引发内存泄漏
```javascript
function problem() {
  var a = new Object();
  var b = new Object();
  a.B = b;
  b.A = a;
  return a,b;
}; problem(); // 无限嵌套
```

---

### 5、引用类型

• 引用类型中的Object类型，访问对象的属性建议使用点表示法；Object类型是一个基础类型，其所有的类型都从Object继承了基本的行为

• 引用类型中的Array类型，数组每一项都可以保存不同类型的数据，而且数组的大小是可以动态调整的，数组包含蛮多方法，具体可以使用Object.getOwnPropertyNames(Array)和Object.getOwnPropertyNames(Array.prototype)来查看
```javascript
var a = [1,2,3,4,5];
a.slice(1,3); // [2,3]
a; // [1,2,3,4,5] slice方法不会改变数组
a.splice(1,3); // [2,3,4]
a; // [1,5] splice方法会改变原数组
var a = [1,2,3,4,5];
a.reduce((prev,cur) => {return prev - cur}); // -13
var a = [1,2,3,4,5];
a.reduceRight((prev,cur) => {return prev - cur}); // -5
```

• 引用类型中的Date类型，Date类型包含蛮多方法，具体可以使用Object.getOwnPropertyNames(Date)和Object.getOwnPropertyNames(Date.prototype)来查看

• 引用类型中的RegExp类型，具体可以看JavaScript专题系列正则表达式

• 引用类型中的Function类型，每个函数都是Function类型的实例，定义函数除了函数声明、函数表达式、还可以使用Function构造函数；函数声明和函数表达式的区别就是函数声明存在提升；call和apply可以拓展函数运行的作用域，具体可以看你不知道的JavaScript上卷有关this的部分
```javascript
var sum = new Function("num1", "num2", "return num1 + num2");
sum(10,20); // 30
```

• 引用类型中的基本包装类型，为了便于操作基本类型值，ECMAScript提供了3个特殊的引用类型，Boolean、Number、String，每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，可以让我们能够调用一些方法来操作这些数据；引用类型值与基本类型值得主要区别在于对象的生存期，使用new操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中，而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间然后被立即销毁，因此基本类型值不可以添加属性和方法
```javascript
var s1 = 'some text';
var s2 = s1.substring(2);
// 大概类似于
var s1 = new String('some text');
var s2 = s1.substring(2);
s1 = null;
// Boolean类型 建议永远不要使用Boolean对象
// Number类型 平常尽量也不要使用
// String类型 使用Object.getOwnPropertyNames(String || String.prototype)来查看方法
String.fromCharCode(104,101,108,108,111); // hello
```

• 引用类型中的单体内置对象，包括Global对象和Math对象。所有在全局作用域中定义的属性和函数都是Global对象的属性，比如isNaN() isFinite() parseInt() parseFloat()等，除此之外，Global对象包括URI编码方法、eval方法等，ECMAScript虽然没有指出如何直接访问Global对象，但Web浏览器将这个对象作为window对象的一部分加以实现的；Math对象用来进行数学相关计算，用的蛮多的，比如ceil()、floor()、round()方法等

---

### 6、面向对象的程序设计

• 本书在对象的属性类型时，参考的是ECMAScript5的描述，具体可看你不知道的JavScript上卷有关对象的部分。ECMAScript中有两种属性，分别是数据属性和访问器属性，数据属性包括4个描述行为的特性，分别是[[Configurable]]、[[Enumerable]]、[[Writable]]和[[Value]]，可以通过Object.defineProperty()来修改，特性默认都是false；访问器属性不包含数据值，包含一对getter和setter函数
```javascript
// 定义多个属性时，可以使用Object.defineProperties()方法，读取属性特性时，可以使用Object.getOwnPropertyDescriptor()方法
var book = {};
Object.defineProperties(book, {
    _year: {
    value: 2004
  },
  edition: {
    value: 1
  },
  year: {
    get: function() {
        return this._year;
    },
    set: function(newValue) {
        if (newValue > 2004) {
        this._year = newValue;
        this.edition += newValue - 2004;
      }
    }
  }
})
```

• JavaScript中的创建对象，可见JavaScript深入系列第14节创建对象的多种方式及优缺点。创建对象包括工厂模式、构造函数模式、原型模式、组合模式、动态原型模式，寄生构造函数模式以及稳妥构造函数模式
```javascript
function Person(name) {
  this.name = name;
  this.friends = ['33', '44', '55']
}
Person.prototype.getName = function () {
  cb(this.name);
}
var person1 = new Person('11');
var person2 = new Person('22');
person1.getName(); // 11
person1.friends.push('66');
cb(person1.friends); // [ '33', '44', '55', '66' ]
person2.getName(); // 22
cb(person2.friends); // [ '33', '44', '55' ]
cb(person1.getName == person2.getName); // true
```

• JavaScript中的继承，可见JavaScript深入系列第15节继承的多种方式及优缺点，继承方式包括原型链继承、借用构造函数的经典继承、结合构造函数和原型链继承的伪经典继承、原生继承、寄生式继承以及最优的寄生组合式继承
```javascript
// 寄生组合式继承
function inheritPrototype(child, parent) {
    var prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}
function Child(name, age) {
    Parent.call(this,name);
  this.age = age;
}
inheritPrototype(Child, Parent);
Child.prototype.sayAge = function() {
    console.log(this.age);
}
var child1 = new Child('小黄鸡', 3);
child1.sayName(); // 小黄鸡
child1.sayAge(); // 3
```

---

### 7、函数表达式

• JavaScript中定义函数的方法有两种，函数声明和函数表达式，函数声明存在函数声明提升的特性，函数表达式没有

• JavaScript中的闭包，闭包是一个函数，能够访问自由变量（自由变量指的是既不是函数参数也不是函数内部变量的变量），并且创建闭包的上下文已经出栈（函数执行完毕），闭包依然可以引用其内部作用域的变量（变量不会销毁）。自由变量需要注意this和arguments，内部函数在搜索这两个变量时，只会搜索到其活动对象为止
```javascript
// 作用域链的配置机制引出一个值得注意的副作用，闭包只能取得包含函数中任何变量的最后一个值
function createFunctions() {
    var result = new Array();
  for (var i = 0; i < 10; i++) {
    result[i] = function() {
        return i; // 这里就是一个闭包
    }
  }
  return result;
}
var res = createFunctions();
res[0](); // 10
// 注意闭包中的内存泄漏现象，如果使用的是引用计数方法的话
function assignHandler() {
    var element = document.getElementById('xxx');
  element.onClick = function() {
    alert(element.id); // 闭包的存在导致element的引用数至少为1
  }
}
```

• JavaScript中的块级作用域，let实现起来蛮简单，闭包也可以实现
```javascript
function outputNumbers(count) {
    for (var i = 0;i < count; i++) {
  }
  console.log(i);
};
outputNumbers(3); // 3
function outputNumbers(count) {
    (function() {
    for (let i = 0;i < count; i++) {
    }
  })(); // 立即执行函数
    console.log(i);
};
outputNumbers(3); // VM599:6 Uncaught ReferenceError: i is not defined
function outputNumbers(count) {
    for (let i = 0;i < count; i++) {
  }
  console.log(i);
};
outputNumbers(3); // VM599:6 Uncaught ReferenceError: i is not defined
```

• JavaScript中的私有变量，私有变量包括函数的参数、局部变量以及函数内部定义的其他函数。访问私有变量就需要用到闭包

---

### 20、JSON

• JSON的语法可以表示包括简单值、对象、数组的值，注意JSON中表示字符串需要是双引号

• 可以通过JSON.stringify()和JSON.parse()来实现将对象序列化为JSON字符串或者将JSON数据解析为JavaScript对象。stringify方法可以传递两个参数，第一个是过滤器，可以是一个数组也可以是一个函数；第二个参数是一个选项，表示是否在JSON字符串中保留缩进；parse方法接受一个参数，是一个函数，将在每个键值对上调用
```javascript
var book = {
    title: "小黄鸡，你好",
  authors: [ "小黄鸡"],
  edition: 3,
  year: 2000
};
var jsonText = JSON.stringify(book); // "{"title":"小黄鸡，你好","authors":["小黄鸡"],"edition":3,"year":2000}"
var bookCopy = JSON.parse(jsonText); // book对象 也算对象深拷贝的一种实现方式 不过有不适用的情况
```

---

### 21、Ajax和Comet

• Ajax技术的核心是XMLHttpRequest对象，IE7+后，创建XHR对象可以直接使用var xhr = new XMLHttpRequest()
```javascript
xhr.open('get','example.txt',false); // 最后一个参数表示是否异步请求
xhr.send(null);
if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
    console.log(xhr.responseText);
} else {
    console.log('Request was unsuccessful: ' + xhr.status);
}
// 异步请求的处理
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) { // readyState可取的值包括0 1 2 3 4
    if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
      console.log(xhr.responseText);
    } else {
      console.log('Request was unsuccessful: ' + xhr.status);
    }
  }
};
xhr.open('get','example.txt',true); // 最后一个参数表示是否异步请求
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 自定义请求头部信息
xhr.send(null); // post请求的话这里带发送的数据
xhr.abort(); // 异步请求的取消
```

• XMLHttpRequest2级规范，第一个是new FormData方法用于表单数据的序列化；第二个timeout属性（仅适用于IE8）；第三个overrideMimeType方法用于重写XHR响应的MIME类型

• XHR中的进度事件，除了onreadystatechange方法，还存在以下几个进度事件，loadstart、progress、error、abort、load、loadend事件

• XHR实现Ajax通信的一个主要限制来源于跨域安全策略，CORS（Cross-Origin Resource Sharing，跨域资源共享）就是解决方法之一，其背后的主要思想是使用自定义的HTTP头部让浏览器和服务器进行沟通，从而决定请求成功还是失败。IE8引入了XDR类型来实现安全可靠的跨域通信，避免CSRF（跨站点请求伪造）和XSS（跨站点脚本）问题；其他浏览器对CORS的实现只需要在标准的XHR对象open方法中传入绝对URL，但是有一些限制，不能使用setRequestHeader()设置自定义头部，不能发送和接收cookie，调用getAllResponseHeaders方法总会返回自定义头部
```javascript
// 跨浏览器的CORS
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) { // 此属性IE10之前都不支持
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}
var request = createCORSRequest('get', 'url');
if (request) {
    request.onload = function() {
    // ...
  }
  request.send();
}
```

• 其他跨域技术，利用DOM中能够执行跨域请求的功能，在不依赖XHR对象的情况下也能发送某种请求。第一种是图像Ping，通过图像Ping，浏览器得不到任何具体的数据，但通过侦听load和error事件，可以知道响应是何时收到的。第二种是JSONP，由两部分组成，回调函数和数据；第三种是使用长轮询和流的方式实现Comet，由服务器向页面推送数据；第四种是SSE（Server-Sent Events）服务器发送事件；第五种是Web Sockets，var socket = new WebSocket('xxxx')，是一种与服务器进行全双工、双向通信的信道
```javascript
// 图像Ping
var img = new Image();
img.onload = img.onerror = function() {
    console.log('Done');
};
img.src = 'xxxx';
// JSONP
function handleResponse(res) {
    console.log(res);
}
var script = document.createElement('script');
script.src = 'xxx?callback=handleResponse';
document.body.insertBefore(script, document.body.firstChild);
```

---

### 22、高级技巧

• JavaScript中的高级函数

如何判断一个对象的类型，使用Object.prototype.toString.call(xxx)；构建作用域安全的构造函数，原因在于不使用new调用构造函数时，构造函数使用的this对象会直接映射到全局对象window上；

惰性载入函数，第一种方法是在第一次if判断是为函数名重新定义内容，第二种是在函数声明时就制定适当的函数，立即执行；使用bind进行函数绑定，bind()方法会创建一个新函数，当这个新函数被调用时，bind()的第一个参数会作为this，之后的一序列参数将会在传递的实参前传入作为它的参数，具体实现可见JavaScript深入系列之bind的模拟实现；

函数的柯里化，本质上同函数绑定一致，使用闭包返回一个函数
```javascript
// 惰性载入方法
function createXHR() {
    if (type XMLHttpRequest !== 'undefined') {
    createXHR = function() {
        return new XMLHttpRequest();
    }
  } else if (typeof ActiveRequest != 'undefined') {
    createXHR = function() {
        reurn xxx;
    }
  } else {
    createXHR = function() {
        throw new Error('xxx');
    }
  }
}
var createXHR = (function() {
    if (type XMLHttpRequest !== 'undefined') {
    return function() {
        return new XMLHttpRequest();
    }
  } else if (typeof ActiveRequest != 'undefined') {
    return function() {
        reurn xxx;
    }
  } else {
    return function() {
        throw new Error('xxx');
    }
  }
})();
// 函数柯里化
function curry(fn) {
    var args = Array.prototype.slice.call(arguments,1);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(null, finalArgs);
  }
}
function add(num1,num2) {
    return num1 + num2;
}
var curriedAdd = curry(add,5);
console.log(curriedAdd(3)); // 8
```

• JavaScript中的防篡改对象方式，可以通过设置对象的[[Configurable]]、[[Writable]]、[[Enumerable]]等属性配置，也可以使用ES5提供的几个方法制定对象的行为。第一种使用Object.preventExtensions(object)，对象将不能被添加属性和方法；第二个保护级别是密封对象，使用Object.seal(xxx)方法，对象除了不可添加属性和方法，删除也是不允许的；最严格的防篡改级别是冻结对象，使用Object.freeze(xxx)方法

• JavaScript中的定时器不是延时程序执行，而是延时程序进入队列；特定情况下的数组分块处理可以避免数组过大导致的栈溢出；函数节流和防抖，具体可见JavaScript专题系列之节流和防抖

• JavaScript中的自定义事件， 观察者模式 发布订阅
```javascript
function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
  // 注册给定类型事件的处理程序
  addHandler: function(type, handler) {
    if (typeof this.handlers[type] == 'undefined') {
        this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  },
  // 触发一个事件
  fire: function(event) {
    if (!event.target) {
        event.target = this;
    }
    if (this.handlers[event.type] instanceof Array) {
        var handlers = this.handlers[event.type];
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i](event);
      }
    }
  },
  // 注销某个类型的事件类型
  removeHandler: function(type, handler) {
    if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type];
      for (var i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === handler) break;
      }
      handlers.splice(i, 1);
    }   
  }
}
function handleMessage(event) {
    console.log(event.message);
}
var target = new EventTarget();
target.addHandler('message', handleMessage);
target.fire({type: 'message', message: 'hello world'});
target.removeHandler('message', handleMessage); // hello world
target.handlers; // {message: Array(0)}
```

• JavaScript中的拖动，这里可以封装一个简单模块供重复使用

---

### 23、离线应用与客户端存储

• JavaScript中的离线检测，navigator.onLine属性

• HTML5的应用缓存，可以看HTML5新加特性了解

• 直接在客户端上存储用户信息，需要用到JavaScript的数据存储

第一种是cookie，cookie的构成由名称、值、域、路径、失效时间以及安全标志组成，document.cookie，以;分割，此外为了绕开浏览器单域名下的cookie数限制，可以使用子cookie，类似这种name=name1=value1&&name2=value2&&...；IE5中，微软通过一个自定义行为引入了持久化用户数据的概念；

第二种是webStorage，当数据需要被严格的控制在客户端时，为了解决cookie的一些限制，webStorage提供了sessionStorage和localStorage对象，具体可看JavaScript专题系列中有关cookie和session的文章；第三种是IndexedDB，是在浏览器中保存结构化数据的一种数据库用来持久化数据

---

### 24、最佳实践

• JavaScript代码的可维护性
```bash
函数名从动词开始，getData()或者handleDataGet()
注意代码间的解耦
不要在原型上重定义已经存在的方法；多使用常量，少使用全局变量
```

• JavaScript代码的性能提升
```bash
将在一个函数中会多次用到的全局对象存储为局部变量；避免改变作用域的with和eval语句

使用变量和数组比访问对象上的属性更有效率；原生方法较快、Switch语句较快、位运算符较快

组合声明变量,组合代码语句

DOM操作时使用文档碎片document.createDocumentFragment()最后再插入，使用
innerHTML，使用事件代理等
```

• JavaScript代码的部署，webpack就不错，最后合成一个js文件

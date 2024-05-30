### this 指向
1. this 的值取决于函数调用时的上下文
- 全局上下文：browser 环境下为 window；node 环境下为 global
- 函数上下文：普通函数内部且非严格模式下为 window；作为对象内的函数使用时为该对象；箭头函数从创建时的父作用域继承 this

2. event.currentTarget and event.target
- link：https://leetcode.cn/problems/array-prototype-last/solutions/2506895/shu-zu-yuan-xing-dui-xiang-de-zui-hou-yi-4phe/#:~:text=event.currentTarget%EF%BC%9A%E8%AF%A5,%E5%88%B0%E7%9A%84%E5%85%83%E7%B4%A0%E3%80%82
- event.currentTarget：该属性引用附加了事件处理程序（如 addEventListener）的元素。这是在事件处理程序函数的上下文中 this 引用的内容。
- event.target：该属性引用引发事件的实际 DOM 元素。对于会冒泡的事件特别重要。如果你点击内部元素，事件将冒泡到外部元素，触发它们的事件监听器。对于这些外部元素，event.target 将是实际被点击的最内层元素，而 event.currentTarget（或 this）将是当前处理程序附加到的元素。
```
// 在这种情况下，如果你点击外部 div，所有三个日志都将打印 "outer"，因为点击的元素（target）和处理程序附加的元素（currentTarget 或 this）是相同的。但是，如果你点击内部 div 中的 "或者点击我" 文本，event.target 将是 "inner"（因为这是你点击的元素），而 event.currentTarget（或 this）仍将是 "outer"（因为这是事件处理程序附加的元素）。
<div id="outer">点击我
  <div id="inner">或者点击我</div>
</div>

<script>
document.getElementById('outer').addEventListener('click', function(event) {
  console.log("currentTarget: ", event.currentTarget.id);
  console.log("this: ", this.id);
  console.log("target: ", event.target.id);
});
</script>
```


### bind()、call()
```
// link：https://leetcode.cn/problems/array-prototype-last/solutions/2506895/shu-zu-yuan-xing-dui-xiang-de-zui-hou-yi-4phe/#:~:text=JavaScript%20%E6%8F%90%E4%BE%9B%E4%BA%86,%E5%BC%95%E7%94%A8%E7%9A%84%E5%AF%B9%E8%B1%A1%E3%80%82
function greet() {
  return `你好，我是 ${this.name}`;
}

let person1 = { name: 'Alice' };
let person2 = { name: 'Bob' };

// 创建一个与 `person1` 绑定的函数（bind()
let greetPerson1 = greet.bind(person1);

console.log(greetPerson1()); // 你好，我是 Alice

// 尝试使用 `call` 方法更改上下文；但是，它仍然使用 `person1` 作为 `this` 上下文
console.log(greetPerson1.call(person2)); // 你好，我是 Alice

// 相比之下，正常函数调用允许使用 `call` 方法设置 `this` 上下文
console.log(greet.call(person2)); // 你好，我是 Bob
```


### 真值、假值
1. 真值、假值
- link：https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy
- 假值如：null、undefined、NaN、''、false、0、-0 等（具体见上述 link

2. 逻辑运算符
- and：a && b；or：a || b；nullish：a ?? b

3. for...of 遍历数组；for...in 遍历对象 or 遍历数组的索引


### hasOwnProperty
1. in（直接 or 间接属性） and for...in（作用于直接属性）
```
const example = {};
example.prop = "exists";

// `hasOwnProperty` 仅对直接属性返回 true：
example.hasOwnProperty("prop"); // 返回 true
example.hasOwnProperty("toString"); // 返回 false
example.hasOwnProperty("hasOwnProperty"); // 返回 false

// 对于直接或继承的属性，`in` 运算符将返回 true：
"prop" in example; // 返回 true
"toString" in example; // 返回 true
"hasOwnProperty" in example; // 返回 true
```


### 只允许一次函数调用
```
/**
 * @param {Function} fn
 * @return {Function}
 */
var once = function(fn) {
  // 通过 isCalled 的 true、false 来判断返回值；isCalled 只定义一次，后续赋值可更改
  let isCalled = false
  return function(...args){
    if (!isCalled) {
      isCalled = true
      return fn(...args)
    }
    return undefined
  }
};

/**
 * let fn = (a,b,c) => (a + b + c)
 * let onceFn = once(fn)
 *
 * onceFn(1,2,3); // 6
 * onceFn(2,3,6); // returns undefined without calling fn
 */
```


### Error
1. error 集合
link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError


### others
1. ...args and arguments

2. splice and slice
- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  - splice 的示例可以多看看：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice#:~:text=%E6%98%AF%E4%B8%8D%E5%8F%AF%E5%8F%98%E7%9A%84%E3%80%82-,%E7%A4%BA%E4%BE%8B,-%E5%9C%A8%E7%B4%A2%E5%BC%95%202
- link: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
- slice 不会改变原数组，slice 会改变（可用 toSpliced 替代，类似于 sort 和 toSorted）

3. sort、compareFunction
```
let arrOne = [1, 10, 2, 20]
let arrTwo = [1, 10, 2, 20]
const resultOne = arrOne.sort()
const resultTwo = arrTwo.sort((a, b) => a - b)
console.log('1', resultOne); // [ 1, 10, 2, 20 ]
console.log('2', resultTwo); // [ 1, 2, 10, 20 ]

// object call sort
let obj = {
  3: '3',
  2: '2',
  1: '1',
}
console.log('here', Array.prototype.sort.call(obj)) // { 1: '1', 2: '2', 3: '3' }
```

4. array、object 转换
- link：Array.form：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
- link：Object.assign：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

- array to object：{...arr}、Object.assign({}, arr)
- object to array：Object.keys、Object.valuse、Object.entries
- object 合并：Object.assign({}, obj1, obj2, ...)

5. 幂运算
- 10 ** 2 // 100；Math.pow(10, 2) // 100

6. Map and Set
- link：https://zh.javascript.info/map-set
- Map 类似于 Object（键值对的形式；支持链式调用
- 注意 Map 对某些类型键（Array、Object）的取值：https://es6.ruanyifeng.com/#:~:text=)%0A//%20undefined-,%E6%B3%A8%E6%84%8F,-%EF%BC%8C%E5%8F%AA%E6%9C%89%E5%AF%B9%E5%90%8C
- Map 与其它数据结构的转换：https://es6.ruanyifeng.com/#:~:text=%EF%BC%881%EF%BC%89-,Map%20%E8%BD%AC%E4%B8%BA%E6%95%B0%E7%BB%84,-%E5%89%8D%E9%9D%A2%E5%B7%B2%E7%BB%8F%E6%8F%90%E8%BF%87
- Set 类似于 Array（值的形式；set.keys() 和 set.valus() 效果是一样的；每个值唯一无重复（可用于快速去重）；支持链式调用；克通过 forEach、for...of 等便利
- map.set()、map.has()；set.add()、set.has()
```
let map = new Map
map.set(1, 1).set(2, 2)...
map.keys()、map.values()、map.entries() 返回值都是可迭代对象（可使用 for...of 来遍历

let set = new Set()
set.add(1).add(2).add(3)
```

- object to map
```
let obj = {
  name: 'john',
  age: 99
}
let map = new Map(Object.entries(obj))
```
- map to object
```
let map = new Map()
map.set('name', 'john').set('age', 99)
let obj = Object.formEntries(map)
```

- set 并集、交集、差集
```
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

7. WeakMap and WeakSet
- link：https://zh.javascript.info/weakmap-weakset
- 与垃圾回收机制有关

8. 同步任务、微任务、宏任务
- 同步任务：立即执行，按顺序执行（console、赋值等
- 微任务：在当前事件循环的末尾执行，优先级高于宏任务（Promise 等
- 宏任务：在下一次事件循环时执行，优先级低于微任务（setTimeout、setInterval 等
- 例题 01：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=30.-,%E8%BE%93%E5%87%BA%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F,-const%20foo%20%3D
```
console.log("同步任务 1");

Promise.resolve().then(() => {
  console.log("微任务 1");
});

console.log("同步任务 2");

setTimeout(() => {
  console.log("宏任务 1");
}, 0);

console.log("同步任务 3");

queueMicrotask(() => {
  console.log("微任务 2");
});

setTimeout(() => {
  console.log("宏任务 2");
}, 0);

console.log("同步任务 4");

同步任务按顺序执行：
输出 "同步任务 1"
输出 "同步任务 2"
输出 "同步任务 3"
输出 "同步任务 4"
微任务在当前事件循环的末尾执行：
输出 "微任务 1"
输出 "微任务 2"
宏任务在下一次事件循环时执行：
输出 "宏任务 1"
输出 "宏任务 2"
```

9. event loop 相关
- link：http://www.ruanyifeng.com/blog/2014/10/event-loop.html
- video：https://www.youtube.com/watch?v=eiC58R16hb8
```
- js 单进程
- 任务（同步、异步）需要排队
  - 同步任务到 call stack（先进后出
  - 异步任务到 task queue or microTask queue（先进先出
    - 异步任务分为微任务（microTask）、宏任务（task）
  - 同步任务执行完后 event loop 将 task queue or microTask queue 中的任务添加到 call stack 中执行
```

10. 变量提升
- 'var 声明的变量会被提升到作用域的顶部，并初始化为 undefined，因此在变量声明之前可以访问，但值为 undefined'
- 'let 和 const 声明的变量会被提升到作用域的顶部，但不会初始化，在声明之前访问这些变量会导致 ReferenceError（称为暂时性死区）。此外，const 声明的变量必须在声明时初始化'

11. **Promise**
- Promise.prototype.catch()：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch

- Promise.prototype.then()：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
  - then(onFulfilled, onRejected)
  - 返回值：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#:~:text=%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%E5%80%BC%EF%BC%9Ap%20%E4%BB%A5%E8%AF%A5%E8%BF%94%E5%9B%9E%E5%80%BC%E4%BD%9C%E4%B8%BA%E5%85%B6%E5%85%91%E7%8E%B0%E5%80%BC%E3%80%82

- Promise.prototype.finally()：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
  - 返回值将被忽略（onFinally 回调函数不接受任何参数，因此不应该在 finally 里面处理与状态相关的逻辑）

- Promise 一创建就会执行
- Promise.all 和 Promise.allSettled 的返回值会和传入的参数顺序一致，无论传参（promise、fetch 等）对应的执行时间

- Promise.allSettled 的返回值
```
// 异步操作成功时
{status: 'fulfilled', value: value}

// 异步操作失败时
{status: 'rejected', reason: reason}
```

```
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

```
<!-- finally -->
<!-- 注意下面这种情况，在 finally 中抛出错误 -->
<!-- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally#:~:text=%E5%A4%87%E6%B3%A8%EF%BC%9A%20%E5%9C%A8%20finally%20%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0%E4%B8%AD%E6%8A%9B%E5%87%BA%E9%94%99%E8%AF%AF%EF%BC%88%E6%88%96%E8%BF%94%E5%9B%9E%E8%A2%AB%E6%8B%92%E7%BB%9D%E7%9A%84%20promise%EF%BC%89%E4%BB%8D%E4%BC%9A%E5%AF%BC%E8%87%B4%E8%BF%94%E5%9B%9E%E7%9A%84%20promise%20%E8%A2%AB%E6%8B%92%E7%BB%9D%E3%80%82%E4%BE%8B%E5%A6%82%EF%BC%8CPromise.reject(3).finally(()%20%3D%3E%20%7B%20throw%2099%3B%20%7D)%20%E5%92%8C%20Promise.reject(3).finally(()%20%3D%3E%20Promise.reject(99))%20%E9%83%BD%E4%BB%A5%E7%90%86%E7%94%B1%2099%20%E6%8B%92%E7%BB%9D%E8%BF%94%E5%9B%9E%E7%9A%84%20promise%E3%80%82 -->
Promise.reject(3)
  .finally(() => { throw 99; })
  .catch(error => console.log(error)); // 输出: 99
```

11. 函数声明提升
- '函数声明提升：函数声明会提升到作用域的顶部。多次声明的同名函数，后声明的会覆盖前声明的'
- '变量声明提升：变量声明会提升到作用域的顶部，但赋值操作会保留在原来的位置（只提升声明，不提升初始化）'
- 函数声明比变量声明更靠前
```
function foo() {
  console.log('foo')
}
var foo = 'here'
function foo() {
  cosnole.log('bar')
}
foo()

等价于下列代码

var foo
function foo(){ console.log('foo') }
function foo(){ console.log('bar') }
foo = 'here'
foo()
```

12. var
- var 作用域（有全局、函数、无块）：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var#:~:text=%E9%87%8D%E8%A6%81%E7%9A%84%E6%98%AF%EF%BC%8C%E5%85%B6%E4%BB%96%E5%9D%97%E7%BA%A7%E7%BB%93%E6%9E%84%EF%BC%8C%E5%8C%85%E6%8B%AC%E5%9D%97%E8%AF%AD%E5%8F%A5%E3%80%81try...catch%E3%80%81switch%20%E4%BB%A5%E5%8F%8A%E5%85%B6%E4%B8%AD%E4%B8%80%E4%B8%AA%20for%20%E8%AF%AD%E5%8F%A5%E7%9A%84%E5%A4%B4%E9%83%A8%EF%BC%8C%E5%AF%B9%E4%BA%8E%20var%20%E5%B9%B6%E4%B8%8D%E5%88%9B%E5%BB%BA%E4%BD%9C%E7%94%A8%E5%9F%9F%EF%BC%8C%E8%80%8C%E5%9C%A8%E8%BF%99%E6%A0%B7%E7%9A%84%E5%9D%97%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%20var%20%E5%A3%B0%E6%98%8E%E7%9A%84%E5%8F%98%E9%87%8F%E4%BB%8D%E7%84%B6%E5%8F%AF%E4%BB%A5%E5%9C%A8%E5%9D%97%E5%A4%96%E9%83%A8%E8%A2%AB%E5%BC%95%E7%94%A8%E3%80%82
- let、const（块）
- 块语句（常见于控制流）：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block

13. 闭包
- 函数 + 声明该函数的词法环境（上下文环境）：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures#:~:text=%E4%B8%8E%E6%AD%A4%E4%B8%8D%E5%90%8C%E3%80%82-,%E5%8E%9F%E5%9B%A0%E5%9C%A8%E4%BA%8E,-%EF%BC%8CJavaScript%20%E4%B8%AD%E7%9A%84%E5%87%BD%E6%95%B0

14. class
- 静态成员、方法（被定义在类自身而不是类的实例上）；实例成员、方法；静态方法调用静态成员，动调动，上述调用是在存在同名成员变量的情况下
- 'constructor() 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor() 方法，如果没有显式定义，一个空的 constructor() 方法会被默认添加。'
```
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```
- 私有属性、方法（# 号表示）；存在静态私有属性、方法

15. 函数参数的长度
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length#:~:text=%E7%A4%BA%E4%BE%8B-,%E4%BD%BF%E7%94%A8%20function%20length,-JS

16 sleep 函数
- 可用于等待一段时间后执行（优化体验
```
function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}
```

17. 变量定义
```
num = 1 // 实际为 global.num = 1 or window.num = 1
console.log(num) // 1
```

18. 给函数添加属性合法
```
function func() {}
console.log('1', func)
func.num = 1
console.log('2', func)

1 [Function: func]
2 [Function: func] { num: 1 }
```

19. 事件传播的三个阶段
- 捕获 -> target -> 冒泡
- '在捕获（capturing）阶段中，事件从祖先元素向下传播到目标元素。当事件达到目标（target）元素后，冒泡（bubbling）才开始'
```
event.target、event.currentTarget、event.stopPropagation()（阻止向上传播
```

20. sessionStorage and localStorage
- sessionStorage
- 生命周期：数据只在页面会话期间有效。页面会话在浏览器打开页面时开始，并在关闭页面或浏览器窗口时结束；数据在同一个页面会话中始终存在，页面刷新或重新加载不会影响数据的存储；关闭浏览器窗口或标签页后，sessionStorage 中的数据将被清除
- 作用范围：数据在同一页面会话的同源窗口（或标签页）中共享；不同页面会话之间的数据不共享，即使它们来自同一个源

- localStorage
- 生命周期：数据具有持久性，即使浏览器关闭后，数据仍然存在；数据只有在明确删除时才会被清除（例如，通过 JavaScript 代码或用户手动清除浏览器存储）；数据在不同的浏览器窗口和标签页中都可用，只要它们属于同一个源（协议、主机和端口）
- 作用范围：数据在同源的所有窗口和标签页中共享；不同源（协议、主机和端口）的数据不共享

```
方法：setItem、getItem、removeItem、clear
```

21. hasOwnProperty and in（操作符）
- 自有属性 and 继承属性：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty#:~:text=%E5%80%BC%E4%B8%BA%20undefined-,%E7%9B%B4%E6%8E%A5%E5%B1%9E%E6%80%A7%20vs%20%E7%BB%A7%E6%89%BF%E5%B1%9E%E6%80%A7,-%E4%BB%A5%E4%B8%8B%E7%A4%BA%E4%BE%8B%E5%8C%BA%E5%88%86

22. continue and break
```
for (let i = 1; i < 5; i++) {
  if (i === 3) continue
  console.log(i) // 1 2 4
}

for (let i = 1; i < 5; i++) {
  if (i === 3) break
  console.log(i) // 1 2
}
```

22. javaScript 类型
- null \ undefined \ number \ string \ boolean \ object(array / object / function) \ symbol \ bigint
- javaScript 中一切都是类型 + 对象

23. 函数参数值传递与引用传递（Array、Object）
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=51.-,%E8%BE%93%E5%87%BA%E7%9A%84%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F,-function%20getInfo

24. 解构赋值
```
let [x] = '123' // 1
let [x] = [1, 2, 3] // 1
let [x] = new Set([1, 2, 3]) // 1
let [x] = new Map([1, 2, 3]) // [1, 1]

let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined

let { foo: baz } = { foo: 'aaa', bar: 'bbb' }; 等价于 let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

25. String.raw（输出原始字符串
- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/raw
```
<!-- 注意下述两者的输出是不一样的 -->
console.log(String.raw`Line1\tLine2`) // Line1\tLine2

const path = `Line1\tLine2` // \t 被转译
console.log(String.raw`${path}`) // Line1 Line2

```

26. 字符串补全
- link（padStart and padEnd）：https://www.zhangxinxu.com/wordpress/2018/07/js-padstart-padend/
```
<!-- 对月份进行补 0 -->
var month = String(new Date().getMonth() + 1).padStart(2, '0')

<!-- 对时间戳进行补 0（前后端时间戳格式不一样时 -->
timestamp = String(timestamp).padEnd(13, '0') // String
timestamp = +String(timestamp).padEnd(13, '0') // Number
```

27. push
- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push
```
<!-- push 方法返回的时执行原数组的长度 -->
let arr = [1, 2]
console.log(arr.push(3)) // 3 - arr.length
```

28. symbol
- link：https://www.zhangxinxu.com/wordpress/2018/04/known-es6-symbol-function/
- Symbol 具有唯一性；Symbol 类型是不可枚举的；Symbol 访问需要用到 `Object.getOwnPropertySymbols()` 方法
```JavaScript
typeof Symbol() === "symbol"
typeof Symbol("foo") === "symbol"
typeof Symbol.iterator === "symbol"

// symbol 对比
let symbolOne = Symbol('yo')
let symbolTwo = Symbol('yo')
symbolOne == or === symbolTwo // false

// 可作为唯一键标识
let info1 = {
  name: '婷婷',
  age: 24,
  job: '公司前台',
  [Symbol('description')]: '平时喜欢做做瑜伽，人家有男朋友，你别指望了'
}
let info2 = {
  [Symbol('description')]: '这小姑娘挺好的，挺热情的，嘿嘿嘿……'
}
let target = {};
Object.assign(target, info1, info2); // target 中会包含两个 symbol，对应的 description 不同

// getOwnPropertySymbols()
let obj = {
  name: 'liu',
  age: 99,
  [Symbol('001')]: 'test001',
  [Symbol('002')]: 'test002',
  [Symbol('003')]: 'test003',
}
console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol(001), Symbol(002), Symbol(003) ]
```

29. import and required
- link（思否讨论）：https://segmentfault.com/q/1010000043526848
- import：编译时加载（效率高、方便排查错误）；import 的内容只可读（本质是 import 引用；import 对象时改变对象的属性是可以的「不建议这样操作」）
- export：可对外输出的东西（函数、类、变量：let、const、var）
- required：运行时加载（可动态引入）；required 的内容可读可写（本质是 required 值的拷贝；多个同模块引用隔离）
```JavaScript
<!-- export default -->
// 第一组
export default function crc32() { // 输出
  // ...
}
import crc32 from 'crc32'; // 输入

// 第二组
export function crc32() { // 输出
  // ...
};
import { crc32 } from 'crc32'; // 输入


<!-- 跨模块常量 -->
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import { A, B } from './constants';
console.log(A); // 1
console.log(B); // 3

<!-- ES2020 中的 import() 函数实现运行时加载 -->
link：https://es6.ruanyifeng.com/#:~:text=constants/index%27%3B-,import(),-%C2%A7%20%E2%87%A7

可通过 async-await 来动态引入 import 中的内容
// say.js
export function hi() {
  alert(`Hello`);
}
export function bye() {
  alert(`Bye`);
}

let { hi, bye } = await import('./say.js');
hi();
bye();
```

30. Boolean and new boolean
- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean
```JavaScript
// 创建基础类型（Boolean）值为 false
let booleanOne = false
// 创建 Boolean 的对象包装器，值为 [Boolean: true]；在 if or Boolean() 中会被判断为 true
let booleanTwo = new Boolean(false)
booleanOne === booleanTwo // false

// 使用建议
const x = Boolean(expression); // use this...
const x = !!expression; // ...or this
const x = new Boolean(expression); // don't use this!
```

31. ...args 剩余参数只能在最后，否则会抛出语法错误
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=94.-,%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88,-%EF%BC%9F
```JavaScript
function getItems(fruitList, ...args, favoriteFruit) {
  return [...fruitList, ...args, favoriteFruit]
}
getItems(["banana", "apple"], "pear", "orange") // SyntaxError

function getItems(fruitList, favoriteFruit, ...args) {
  return [...fruitList, ...args, favoriteFruit]
}
getItems(["banana", "apple"], "pear", "orange") // [ 'banana', 'apple', 'orange', 'pear' ]
```

32. Object 转换为字符串
```JavaScript
let obj = { name: 'liu' }
console.log(obj + 'here') // [object Object]here（Object 都会被转换成 [object Object] or [Object object]
```

33. JSON.stringify and JSON.parse
- JSON.stringify：JS 值转换为 JSON 字符串
- JSON.parse：JSON 字符串转换为 JS 值

34. eval
- link：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
- 'eval() 函数会将传入的字符串当做 JavaScript 代码进行执行'


### answer
1. null vs undefined
- undefined 用于指示不存在任何值或者缺少属性；如定义了变量未赋值该变量默认会是 undefined，或者函数接受参数时但是未传参该参数会默认是 undefiend；用于变量声明未赋值、函数无返回参数或默认传参但没传、访问对象不存在的属性
- null 会被显性的分配给变量、属性或者需要该特殊值的任何对象值，通常用于特殊处理；用于显性的将变量初始化、表示一个对象已被清空（不指向任何对象）

2. 如何将 html 页面转换为图片
- html2canvas 库：https://html2canvas.hertzen.com/
```
<template>
  <div class="demo" id="demo" @click="downloadHtml">
    {{ 'this is a demo html' }}
  </div>
<template>

<script setup>
import html2canvas from 'html2canvas'

const downloadHtml = () => {
  const demoDOM = document.getElementById('demo')
  html2canvas(demoDOM).then((canvas) => {
    <!-- canvas 回调 -->
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.src = canvas.toDataURL('image/png')

    <!-- 创建 a 标签 -->
    const a = document.createElement('a')
    a.innerHTML = 'click to download'
    a.download = 'demo.png'
    a.href = img.src

    document.body.appendChild(a)
  })
}
</script>
```

3. 函数与模版字面量
```
function getPersonInfo(one, two, three) {
  console.log(one)
  console.log(two)
  console.log(three)
}

const person = 'Lydia'
const age = 21

getPersonInfo`${person} is ${age} years old`

输出：["", " is ", " years old"] "Lydia" 21
```

4. 对象引用
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=46.-,%E8%BE%93%E5%87%BA%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F,-let%20person%20%3D
```
let objOne = { name: 'liu' }
let objTwo = objOne

<!-- objOne、objTwo 两者原本引用同一个对象，这里将 objOne 的引用指向 null -->
objOne = null
console.log(objOne); // null
console.log(objTwo); // { name: 'liu' }

<!-- 2 -->
objOne.name = 'da'
console.log(objOne); // { name: 'da' }
console.log(objTwo); // { name: 'da' }
```

5. parseInt
```
['1', '2', '3'].map(parseInt)

等价于

['1', '2', '3'].map((item, index) => {
  return parseInt(item, index)
})
parseInt(1, 0) // 1
parseInt(2, 1) // NaN
parseInt(3, 2) // NaN
```

6. String.raw
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=72.-,%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88%EF%BC%9F,-console.log
```
<!-- path 定义时 \D、\P、\t 会被转译（其中 \D、\P 无效果 -->
const path = `C:\Documents\Projects\table.html`
String.raw`${path}` // "C:DocumentsProjects able.html"

String.raw`C:\Documents\Projects\table.html` // C:\Documents\Projects\table.html
```

7. 普通函数和箭头函数的 prototype
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=92.-,%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88%EF%BC%9F,-function%20giveLydiaPizza(
- '每一个函数（无论是函数声明还是函数表达式「这里函数表达式需要排除箭头函数」）在创建时都会自动拥有一个 prototype 属性，这个属性是一个对象。这个对象默认会有一个 constructor 属性指向函数自身'
  - 函数声明和函数表达式（除开箭头函数）在创建时都会自动拥有一个 prototype 属性；Prototype 属性 是一个对象，这个对象默认会有一个 constructor 属性指向函数自身
  - 箭头函数没有 prototype 属性；箭头函数不能用作构造函数，不能使用 new 操作符实例化
``` JavaScript
function funcOne() {}
const funcTwo = () => {}
const funcThree = function() {}

console.log('1', funcOne.prototype) // {}
console.log('2', funcTwo.prototype) // undefined
console.log('3', funcThree.prototype) // {}
```

8. JS 处理解释语句
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=106.-,%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88%EF%BC%9F,-const%20colorConfig%20%3D
- 'JavaScript 解释（或取消装箱）语句。当我们使用方括号表示法时，它会看到第一个左方括号 `[` 并一直进行下去，直到找到右方括号 `]`。只有这样，它才会评估该语句。如果我们使用了 colorConfig[colors[1]]，它将返回 colorConfig 对象上 red 属性的值'
```JavaScript
const colorConfig = {
  red: true,
  blue: false,
  green: true,
  black: true,
  yellow: false,
}

const colors = ["pink", "red", "blue"]

console.log(colorConfig.colors[1]) // TypeError
console.log(colorConfig[.colors[1]]) // true
```

9. Generator
- link：https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md#:~:text=112.-,%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88%EF%BC%9F,-function*%20generatorOne
```JavaScript
function* generatorOne() {
  yield ['a', 'b', 'c'];
}

function* generatorTwo() {
  yield* ['a', 'b', 'c'];
}

const one = generatorOne()
const two = generatorTwo()

console.log(one.next().value) // ['a', 'b', 'c']
console.log(one.next().value) // undefined

console.log(two.next().value) // a
console.log(two.next().value) // b
console.log(two.next().value) // b
console.log(two.next().value) // undefined
```
### 现代 javaScript 教程必读
- Promise: https://zh.javascript.info/async
- 网络请求：https://zh.javascript.info/network

### 防抖、节流
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5
2. 节流：'控制函数执行频率，在一定时间内只能执行一次，适用于需要限制频率的场景'
- 如滚动事件（scroll）、窗口大小变化
```JavaScript
function throttle(fn) {
  let canRun = true // 通过闭包保存一个标记
  return function () {
    if (!canRun) return // 在函数开头判断标记是否为true，不为true则return
    canRun = false // 立即设置为false
    setTimeout(() => {
      // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments)
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true
    }, 500)
  }
}
function sayHi(e) {
  console.log(e.target.innerWidth, e.target.innerHeight)
}
window.addEventListener('resize', throttle(sayHi))
```

3. 防抖：'在事件停止触发后一段时间才执行函数，适用于需要在操作停止后进行处理的场景'
- 输入框搜索、按钮点击
```JavaScript
function debounce(fn) {
  let timeout = null // 创建一个标记用来存放定时器的返回值
  return function () {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments)
    }, 500)
  }
}
function sayHi() {
  console.log('防抖成功')
}

var inp = document.getElementById('inp')
inp.addEventListener('input', debounce(sayHi)) // 防抖
```

4. 两者都是通过闭包创建一个局部变量，通过该局部变量来判断事件是否执行；防抖在于短时间内的重复操作只有最后一次操作会起作用；节流在于节省性能开销（固定时间间隔下执行一次）
- 如 scroll 事件中，防抖可以在滚动停止时触发事件来进行后续操作（在于只触发一次）；而节流可以在滚动事件中间隔一段固定的时间去触发事件（如更新实时滚动位置、触发动画，通过此来减少滚动过程中每一帧「帧、秒都可以，看怎么理解」变化都要触发事件的开销）

### setTimeout、Promise、async and await
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/33
- 异步代码题：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7
2. 微任务、宏任务分类
- microtask
  - process.nextTick
  - promise
  - Object.observe (废弃)
  - MutationObserver
- macrotask
  - setTimeout
  - setImmediate
  - setInterval
  - I/O
  - UI 渲染
3. async-await 为什么是异步的：在 async-await 构建的上下文中代码是同步的；但与该上下文平行的其它代码块相当于 async-await 是异步的；await 只是暂停 async 函数而不阻塞整个线程
4. ![interview-note-事件循环](../interview-note/image/event-loop.jpeg)
```JavaScript
// 注意 async1 end 的输出顺序
async function async1() {
  console.log('async1 start')
  await async2()
  // await 后续代码被放入微任务队列中
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}

console.log('script start')
async1()
console.log('script end')

// 输出顺序：
// script start
// async1 start
// async2
// script end
// async1 end

// 继发、并发
// 继发一
async function loadData() {
  var res1 = await fetch(url1)
  var res2 = await fetch(url2)
  var res3 = await fetch(url3)
  return 'when all done'
}
// 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url)
    console.log(await response.text())
  }
}

// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)])
  return 'when all done'
}
// 并发二
async function loadData(urls) {
  // 并发读取 url
  const textPromises = urls.map(async (url) => {
    const response = await fetch(url)
    return response.text()
  })
  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise)
  }
}
```

### 判断数组的方法
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/23
2. 三种方法 
- Object.prototype.toString().call()
- instanceof
- Array.isArray
```JavaScript
let arr = [1, 2]
let num = 1
let str = '1'
let obj = { name: 'liu' }
// 需要加 call
console.log('1', Object.prototype.toString.call(arr)) // '[object, Array]'
console.log('11', Object.prototype.toString.call(num)) // '[object, Number]
console.log('111', Object.prototype.toString.call(str)) // '[object, String]
console.log('1111', Object.prototype.toString.call(obj)) // '[object, Object]
console.log('2', Array.isArray(arr)) // true
console.log('3', arr instanceof Array) // true
console.log('4', arr instanceof Object) // true（所有类型对 instanceof Object 都返回 true

// 兼容性
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```

### 实现 sleep 函数
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63
```JavaScript
// Promise
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
sleep(1000).then(() => {
  console.log(1)
})

// Generator
function* sleepGenerator(time) {
  yield new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
}
sleepGenerator(1000)
  .next()
  .value.then(() => {
    console.log(1)
  })

// async
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
async function output() {
  let out = await sleep(1000)
  console.log(1)
  return out
}
output()

// ES5
function sleep(callback, time) {
  if (typeof callback === 'function') {
    return setTimeout(callback, time)
  }
}

function output() {
  console.log(1)
}
sleep(output, 1000)
```

### ts 的优点和缺点
1. 优点：https://wangdoc.com/typescript/intro#%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B%E7%9A%84%E4%BC%98%E7%82%B9
2. 缺点：https://wangdoc.com/typescript/intro#%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B%E7%9A%84%E7%BC%BA%E7%82%B9
- 丧失了灵活性
- 引入了独立的编译步骤：类型编译、ts 代码转为 js
- 兼容性问题

### devDependencies 和 dependencies
1. devDependencies 应用于开发环境和构建过程，不会应用于生产环境
- 好处在于可以区分开发、生产环境依赖；优化生产环境，减少部署的包大小，从而优化性能和资源使用；提高可维护性，更好的管理和维护项目的依赖关系
- 如 ESLint 用于在开发环境中检查代码规范、Jest 用于在开发环境中进行单元测试

2. dependencies 应用于生产环境

### 事件简介
1. onXXX
- 不能为一个事件分配多个处理程序；后面的事件会覆盖前面的事件
```HTML
<input type="button" id="elem" onclick="alert('Before')" value="Click me">
<script>
  elem.onclick = function() { // 覆盖了现有的处理程序
    alert('After'); // 只会显示此内容
  };
</script>

<!-- 取消事件 -->
elem.onclick = null
```

```JavaScript
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // 替换了前一个处理程序
```

2. addEventListener 替代 onXXX
```JavaScript
// 触发
element.addEventListener(event, handler[, options]);

// 移除
element.removeEventListener(event, handler[, options]);

// options 参数
- onec：true、false（触发后自动删除监听器

// 正确的移除操作（handler 参数需是同一个函数，即同一个引用
function handler() {
  alert( 'Thanks!' );
}
input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```

3. event 事件
- event.type
- event.currentTarget（注意箭头函数 eventTarget 的区分
  - 普通函数 this 会指向绑定事件的元素
  - 箭头函数没有自己的 this 绑定，它会从定义它的上下文（即其外部作用域）中继承 this。这意味着 this 在箭头函数中不会指向事件绑定的元素，而是指向箭头函数定义时的上下文
```HTML
<!-- 普通函数 -->
<!DOCTYPE html>
<html>
  <head>
    <title>普通函数 currentTarget 示例</title>
  </head>
  <body>
    <button id="myButton">Click me</button>

    <script>
      document
        .getElementById('myButton')
        .addEventListener('click', function (event) {
          console.log(event.currentTarget) // <button id="myButton">Click me</button>
          console.log(this) // <button id="myButton">Click me</button>
        })
    </script>
  </body>
</html>

<!-- 箭头函数 -->
<!DOCTYPE html>
<html>
  <head>
    <title>箭头函数 currentTarget 示例</title>
  </head>
  <body>
    <button id="myButton">Click me</button>

    <script>
      document.getElementById('myButton').addEventListener('click', (event) => {
        console.log(event.currentTarget) // <button id="myButton">Click me</button>
        console.log(this) // Window object or undefined depending on the context
      })
    </script>
  </body>
</html>
```

### blog 总结 01（js 中的类型
1. link：https://yutengjing.com/posts/%E5%85%A8%E9%9D%A2%E6%80%BB%E7%BB%93-javascript-%E7%B1%BB%E5%9E%8B%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%E7%82%B9/

2. string 字符串
```JavaScript
const obj = {
  name: '1',
  age: 1,
}
console.log('1', obj) // { name: '1', age: 1 }
console.log('2', JSON.stringify(obj), typeof JSON.stringify(obj)) // "{"name":"1","age":1}"string
console.log('3', `${obj}`) // [object, Object]
```

3. number
- js 精度问题：精度在可控制范围内可看作相等；引用第三方库；使用 bigInt
```JavaScript
const result = 0.1 + 0.2;
console.log(result); // => 0.30000000000000004
// 精度要求误差小于 1 亿分之一
const isEqual = result - 0.3 < 1e-8;
console.log(isEqual); // => true
```

- 取整问题
```JavaScript
// 向下取整
console.log(Math.floor(2.6)); // => 2
// 向上取整
console.log(Math.ceil(6.1)); // => 7
// 四舍五入
console.log(Math.round(0.4)); // => 0
console.log(Math.round(0.5)); // => 1
// 纯粹的取整，不要小数部分
console.log(Math.trunc(0.6)); // => 0
console.log(Math.trunc(0.4)); // => 0
console.log(Math.trunc(-0.8)); // => 0
```

4. boolean
```JavaScript
Object.is(NaN, NaN) // true
console.log(NaN === NaN) // false

// 判断一个变量是不是 NaN
Number.isNaN()
```

5. undefined and null
- undefined 表示一个变量被声明了但是没被赋值，而 null 表示获取不到值，一般是你刻意设置的空值
```JavaScript
// ==：value 是在判断是否与 undefined、null 相等
if (value == null) {...}
console.log(null == undefined) // true
console.log(null === undefined) // false
```

6. typeof
```JavaScript
console.log(typeof abc) // => undefined
console.log(def instanceof Object) // 报错：ReferenceError: def is not defined

// 暂时性死区的情况
function test() {
  console.log(typeof num1) // error
  console.log(typeof num2) // error
  const num1 = 1
  let num2 = 2
}
test()

// 判断类的实例
console.log(typeof Number(6)); // => number
console.log(typeof new Number()); // => object
console.log(typeof new Boolean(false)); // => object
```

7. instanceof
- 用于检查对象与构造函数之间的关系，通过检查对象的原型链
```JavaScript
// 源码实现
const isObject = require('../is/isObject');
function instanceOf(obj, constructor) {
  if (!isObject(constructor)) {
    throw new TypeError(`Right-hand side of 'instanceof' is not an object`);
  } else if (typeof constructor !== 'function') {
    throw new TypeError(`Right-hand side of 'instanceof' is not callable`);
  }
  // isPrototypeOf 是 JavaScript 中的一个内置方法。它是 Object.prototype 上的方法，用于检查一个对象是否在另一个对象的原型链上。具体来说，constructor.prototype.isPrototypeOf(obj) 用来判断 obj 是否是 constructor 构造函数的实例
  return constructor.prototype.isPrototypeOf(obj);
}

// instanceof 不能用于判断基本类型
console.log(1 instanceof Number); // => false
console.log(Symbol() instanceof Symbol); // => false
console.log(BigInt(5) instanceof BigInt); // => false2
```

8. Object.prototype.toString().call()
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
```JavaScript
const toString = Object.prototype.toString

// null 和 undefined 有区分
console.log(toString.call(1)) // => [object Number]
console.log(toString.call(true)) // => [object Boolean]
console.log(toString.call(null)) // => [object Null]
console.log(toString.call(undefined)) // => [object Undefined]
console.log(toString.call({})) // => [object Object]
console.log(toString.call(new Date())) // => [object Date]
console.log(toString.call(/e/)) // => [object RegExp]
function Foo() {}
console.log(toString.call(new Foo())) // => [object Object]

// 加 call 与不加 call
// 普通类型
const toString = Object.prototype.toString

console.log(toString(1)) // => Error: Cannot convert object to primitive value
console.log(toString(true)) // => Error: Cannot convert object to primitive value
console.log(toString(null)) // => Error: Cannot convert object to primitive value
console.log(toString(undefined)) // => Error: Cannot convert object to primitive value

console.log(toString.call(1)) // => [object Number]
console.log(toString.call(true)) // => [object Boolean]
console.log(toString.call(null)) // => [object Null]
console.log(toString.call(undefined)) // => [object Undefined]

// 对象类型
const toString = Object.prototype.toString

console.log(toString({})) // => [object Undefined]
console.log(toString(new Date())) // => [object Undefined]
console.log(toString(/e/)) // => [object Undefined]
function Foo() {}
console.log(toString(new Foo())) // => [object Undefined]

console.log(toString.call({})) // => [object Object]
console.log(toString.call(new Date())) // => [object Date]
console.log(toString.call(/e/)) // => [object RegExp]
function Foo() {}
console.log(toString.call(new Foo())) // => [object Object]

// 对象自定义 toString 方法
const obj = {
  toString() {
    return 'Custom toString'
  },
}
console.log(obj.toString()) // => Custom toString

const toString = Object.prototype.toString
console.log(toString.call(obj)) // => [object Object]
```

9. lodash 中的 isObject
- 检查一个值是否是对象（对象、数组、函数等）
```JavaScript
function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
```

### blog 总结 02（ts 类型体操实例解析
1. link：https://yutengjing.com/posts/ts-%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E5%AE%9E%E4%BE%8B%E8%A7%A3%E6%9E%90/

2. PromiseValue
- 条件类型：条件类型让 ts 的类型空间有了条件控制流
- infer 运算符：infer 运算符用于在模式匹配中定义一个类型变量，这个类型变量的具体类型由编译器根据模式匹配来推断
```TypeScript
// PromiseValue
type PromiseValue<T extends Promise<unknown>> = T extends Promise<infer A> ? A : never

// 条件类型
A extends B ？C : D
```

3. ts 实现首字母大写
```TypeScript
type LetterMapper = {
  a: 'A'
  b: 'B'
  c: 'C'
  d: 'D'
  e: 'E'
  f: 'F'
  g: 'G'
  h: 'H'
  i: 'I'
  j: 'J'
  k: 'K'
  l: 'L'
  m: 'M'
  n: 'N'
  o: 'O'
  p: 'P'
  q: 'Q'
  r: 'R'
  s: 'S'
  t: 'T'
  u: 'U'
  v: 'V'
  w: 'W'
  x: 'X'
  y: 'Y'
  z: 'Z'
}
type CapitalFirstLetter<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends keyof LetterMapper
      ? `${LetterMapper[First]}${Rest}`
      : S
    : S

// 每个字母都需大写（递归实现即可
type UpperCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${CapitalFirstLetter<First>}${UpperCase<Rest>}`
  : S // 当 S 是空串便会走这个分支，直接返回空串即可
```

4. infer 模版操作
```TypeScript
// 提取函数返回类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Func = () => string
type Result = MyReturnType<Func> // string

// 提取 Promise 的解析类型
type MyAwaited<T> = T extends Promise<infer U> ? U : T
type ExamplePromise = Promise<string>
type Result = MyAwaited<ExamplePromise> // string

// 提取元组中第一个、最后一个元素的类型
type Last<T extends any[]> = T extends [...infer Rest, infer Last]
  ? Last
  : never
type First<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First
  : never
type ExampleTuple = [string, number, boolean]
type LastElement = Last<ExampleTuple> // boolean

// 提取数组最后一个元素
type LastArrayElement<T extends any[]> = T extends [...infer Rest, infer Last]
  ? Last
  : never
```

5. 实现 isNever
```TypeScript
// 标记的方式很多
type IsNever<T> = [T] extends [never] ? true : false
type IsNever<T> = T[] extends never[] ? true : false
type IsNever<T> = (() => T) extends () => never ? true : false

// 不能用下述的原因
type isNever<T> = T extends never ? true : fasle
type test1 = isNever<never> // never：never extends never 返回 never
```

### blog 总结 03（常见 ts 类型推断
1. link：https://yutengjing.com/posts/ts%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E6%8A%80%E5%B7%A7%E6%80%BB%E7%BB%93/

2. IsUnknown
```TypeScript
type IsUnknown<T> = unknown extends T ? true : false
```

3. ts 判断类型相等
```TypeScript
// 不完善（对于判断联合类型、any 存在问题；注意只在有泛型传参的时候存在
// 对于联合类型作用于泛型参数来说会分发内部属性，以此来单个判断
type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false
type R1 = IsEqual<1 | 2, 1> = IsEqual<1, 1> | IsEqual<2, 1> = true | false // boolean
type R2 = IsEqual<1, 1 | 2> // boolean，原理同上

// 没有泛型传参时
type a1 = 1 | 2 extends 1 ? true : false // false

// 通过 [] 包一层（还是会存在 any 的问题
type IsEqualWithBrackets<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false
// any 可与任何类型兼容（可以赋值给任何类型，也可以接受任何类型的值）；unknown 只能赋值给 unknown 和 any
type R3 = IsEqualWithBrackets<any, string> // true
type R4 = IsEqualWithBrackets<any, unknown> // true

// 最终方法（其中 1、2 是可以变的，只要两个函数返回的可选结果一样即可
type IsEqualMaster<T, U> = (<T1>() => T1 extends T ? 1 : 2) extends <
  T2
>() => T2 extends U ? 1 : 2
  ? true
  : false

// 任何 T1 都可以 extends T（即 any）所以返回 1；T2 只能是 string 时才能 extends U（即 string），所以该函数返回 1、2 是不确定的
type R5 = IsEqualMaster<any, string> // false
// T1 取 string 时返回 1，T2 取 number 时返回 1
type R6 = IsEqualMaster<string, number> // false
```

4. any 和 unknown
- unknown 只能赋值给 unknown 和 any
```TypeScript
// unknown 只能赋值给 any、unknown
let v:unknown = 123;
let v1:boolean = v; // 报错
let v2:number = v; // 报错
```

- 任何值都难赋值给 unknown
```TypeScript
// 任何值都难赋值给 unknown
let x:unknown;
x = true; // 正确
x = 42; // 正确
x = 'Hello World'; // 正确
```

- any、unknown extends 任何类型都是 true
```TypeScript
type Result1<T> = T extends any ? true : false // true
type Result2<T> = T extends unknown ? true : false // true
```

5. ts 实现 merge
```TypeScript
// 在泛型 I 中去除与 never 相同的属性
type IntersectionToInterface<I> = Omit<I, never>

// Omit<A, keyof B> 对应 { age: 27 }
// { age: 27 } & B 对应 { name: '1', age: 27, height: 170 }
type Merge<A, B> = IntersectionToInterface<Omit<A, keyof B> & B>

type A = {
  name: 'ly'
  age: 27
}

type B = {
  name: '1'
  height: 170
}

type C = Merge<A, B>

/*
type C = {
  name: "1";
  age: 27;
  height: 170;
}
*/
```

6. ts 类型体操编码习惯
- 创建泛型参数
```TypeScript
// bad
type NumsToStrs<U extends number> = U extends U ? `${U}` : never
// good
type NumsToStrs<U extends number, E = U> = E extends U ? `${E}` : never
```

- 泛型参数命名
  1. 字符串我们就用 S
  2. 数字可以用 Num 或者干脆 N
  3. 字符串数组可以用 Strs，数字数组可以用 Nums
  4. 元组的第一个成员用 First，最后一个成员用 Last，infer 出来的 spread 数组用 Rest
  5. union 类型用 U
  6. 成员是任意类型的数组可以用 Arr 或 List
  7. 循环下标的数组可以用 Index
  8. 结果可以用 Result 或者 Acc
  9. 任意类型用 T
  10. 任意的两个类型用 A 和 B

- extends 数组时最好加上 readonly，同时最好用 unknwon 代替 any（unknown[] 代替 an[]）
```TypeScript
type Type1<T extends readonly unknown[]> = ...
```

- 编写长类型需要注意的点
  1. 按照标准格式去缩进
  2. 必要时使用括号提高优先级
  3. 抽离中间类型，性能一般还会更好
  4. 适当增加辅助泛型参数
```TypeScript
// extends 的缩进：? 和 : 就不要写到一行，每次碰到 extends 就换行加缩进
A extends B
  ? true
  : false
```

### uniapp 位置相关
1. link：https://uniapp.dcloud.net.cn/api/location/location.html#chooselocation

2. uni.getLocation()
```JavaScript
uni.getLocation({
  // wgs84 默认返回 gps 坐标
  type: 'wgs84',
  success: function (res) {
    console.log('当前位置的经度：' + res.longitude)
    console.log('当前位置的纬度：' + res.latitude)
  },
})
```

3. uni.chooseLocation()
```JavaScript
uni.chooseLocation({
  success: function (res) {
    console.log('位置名称：' + res.name)
    console.log('详细地址：' + res.address)
    console.log('纬度：' + res.latitude)
    console.log('经度：' + res.longitude)
  },
})
```



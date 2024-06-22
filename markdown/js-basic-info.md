### async await and map
- 用 Promise.all 保证 map 循环中调接口返回的数据顺序一致
```JavaScript
// result 中的数据是按顺序返回的
const result = Promise.all(list.map(async (item) => {
  retrun await fetch()
}))
```

### 递归
1. 递 + 归
- 过多的递归层数（递归深度）可能会导致栈溢出

2. 1 + ... + 100（先递后归
```JavaScript
function recur(n) {
  // 终止条件
  if (n === 1) return 1

  // 递：递归调用
  const res = recur(n - 1)

  // 归：返回结果
  return res + n
}
console.log('result', recur(100))
```

3. 尾递归
```JavaScript
function tailRecur(n, res) {
  if (n === 0) return res

  return tailRecur(n - 1, res + n)
}

function tailRecur(n, 0) {
  if (n === 0) return 0

  // 递、归同时操作
  return tailRecur(n - 1, n)
}
```

4. 给定一个斐波那契数列 0, 1, 1, 2, 3, 5, 8, 13, … ，求该数列的第 n 个数字
fib(0) -> 0
fib(1) -> 1
fib(2) -> fib(1) + fib(0) -> 1 + 0 -> 1

```JavaScript
function fib(n) {
  if (n === 1 || n === 2) {
    return n -1
  }

  return fib(n - 1) + fib(n - 2)
}
```

### 时间复杂度
1. 𝑂(1) < 𝑂(log 𝑛) < 𝑂(𝑛) < 𝑂(𝑛 log 𝑛) < 𝑂(𝑛2) < 𝑂(2𝑛) < 𝑂(𝑛!)

### 数据结构
1. 线性、非线性（树状、网状）
- stack（push、pop；first in last out
- queue（push、pop；first in first out

- array：连续内存分配；连续空间储存；静态
- linked list：可不连续内存分配；分散空间储存；动态

2. bit and byte
- 1 byte = 8 bit
- 1 byte：最小寻址内存单元

3. chrome V8 引擎中将 array 分为快 array 和慢 array
- https://juejin.cn/post/7004038556750446623
- 解释了 js 中 array 可以由不同数据类型的值组成
- 可以使用多种方法改变数据内容（push、pop、shift、sort 等
- array 可被分配在栈 or 堆上

4. linked list
- node（节点值、指向下一个节点的指针
- 单向、环形、双向（浏览器历史）

- 插入节点
```JavaScript
// 在链表的节点 n0、n1 之间插入节点 P
function insert(n0, P) {
  const n1 = n0.next;
  P.next = n1;
  n0.next = P;
}
```

- 删除节点
```JavaScript
// 删除链表的节点 n0 之后的首个节点
function remove(n0) {
  if (!n0.next) return;
  // n0 -> P -> n1
  const P = n0.next;
  const n1 = P.next;
  n0.next = n1;

  // 手动释放内存
  P.next = none
}
```

5. list
- 抽象的数据结构（可基于 array or linked list 形成

### vscode shortcuts
1. `ctrl + shift + o`
- 类似于 ctrl + f，可搜索特定 template、style、script 中的内容

2. `ctrl + u`
- 回到上一次编辑的位置（如 Vue 中在 template 编辑后跳转到 script 中编辑，通过次快捷键可快速回到 template 上次编辑中的位置

3. `ctrl + shift + k`
- 可删除光标选区的代码（不管是不是全部选中了）
- ctrl + x 只会删除选中的

4. `ctrl + k and ctrl + f`
- 格式化光标选区（适用于维护老代码，很多没配置格式化

5. `ctrl + (shift) + pageUp or pageDown`
- 不加 shift：切换 tab 文件
- 加...：移动 tab 文件

6. 添加 JSDoc
- 输入 `/**` return 即可

### vim 简明教程
1. normal 模式
- :wq、ZZ（存盘退出
- dd 删除当前行、p 黏贴当前行
- hjkl（左下上右；0 首；$ 尾
- o 当前行后插入新东西；O 当前行前插入
- u（undo

### npm run dev
1. 指定 port 启动
- npm run dev -- --port 8080

### `?.` 可选链操作符的实现
- 0 || 1 -> 1
- 0 ?? 1 -> 0
- (null or undefined) ?? 1 -> 1
- 不建议在 Vue template 中使用 ?. 和 ?? 运算符（暂时不识别
- condition != null 等价于 condition !== null && condition !== undefined
- 空值：null、undefined；假值：0、-0、NaN、false、''、null、undefined；真值：除假值之外的（可用 Boolean 来判断

```JavaScript
let obj = {
  key: 'key',
  value: 'value',
  inlineObj: {
    key: 'key',
    value: 'value',
  }
}

// 可选链
console.log('here 111', obj.inlineObj?.key)

// 可选链实现（多层的话创建临时变量，单层的话判断自身
const temp = obj.inlineObj
console.log('here 222', [null, undefined].includes(obj.inlineObj) ? undefined : temp.key)
```

### if else、switch case 代码简化
- 通过 key - value 键值对来简化

```JavaScript
// 只需要取值
function getTranslationMap(rhyme) {
  const rhymes = {
    "apples and pears": "Stairs",
    "hampstead heath": "Teeth",
    "loaf of bread": "Head",
    "pork pies": "Lies",
    "whistle and flute": "Suit",
  };
  return rhymes[rhyme.toLowerCase()] ?? "Rhyme not found";
}

// 需要用到方法等
function calculate(num1, num2, action) {
  const actions = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
  };

  // 同时用到 ?. 和 ??
  return actions[action]?.(num1, num2) ?? "Calculation is not recognised";
}
```

### commonjs and esm
1. '加载一个模块脚本时不需要使用 defer 属性模块会自动延迟加载。'

2. export and import 时注意命名冲突
```JavaScript
// import 时处理
import {
  name as squareName,
  draw as drawSquare,
  reportArea as reportSquareArea,
  reportPerimeter as reportSquarePerimeter,
} from "./modules/square.js";

import {
  name as circleName,
  draw as drawCircle,
  reportArea as reportCircleArea,
  reportPerimeter as reportCirclePerimeter,
} from "./modules/circle.js";

import {
  name as triangleName,
  draw as drawTriangle,
  reportArea as reportTriangleArea,
  reportPerimeter as reportTrianglePerimeter,
} from "./modules/triangle.js";

// export 时处理
export {
  name as squareName,
  draw as drawSquare,
  reportArea as reportSquareArea,
  reportPerimeter as reportSquarePerimeter,
};

// 创建模块对象解决，每个模块对象中可包括同名的变量、方法等
import * as Canvas from "./modules/canvas.js";
import * as Square from "/./modules/square.js";
import * as Circle from "./modules/circle.js";
import * as Triangle from "./modules/triangle.js";
```

3. 合并模块
- 通过一个外层的 .js 文件做跳板
```JavaScript
// shapes.js
export { Square } from "/js-examples/modules/module-aggregation/modules/shapes/square.js";
export { Triangle } from "/js-examples/modules/module-aggregation/modules/shapes/triangle.js";
export { Circle } from "/js-examples/modules/module-aggregation/modules/shapes/circle.js";

// main.js
import { Square, Circle, Triangle } from "./modules/shapes.js";
```

4. 变量提升、函数提升
- js 中变量创建分为定义 + 赋值（先定义后赋值
- 所有变量、函数都会提升（函数在变量前
```JavaScript
console.log('msg 111', msg) // undefined
add(1, 2)

var msg = 'hello'
function add(a, b) {
  console.log('a + b', a + b) // 3
  console.log('msg 222', msg) // undefined
  return a + b
}
```

```JavaScript
// 下面两函数等价
function test() {
  console.log('1', property)
  var property = 1
  console.log('2', property)
  function property() {}
  console.log('3', property)
}

function test() {
  function property() {}
  var property
  
  console.log('1', property)
  var property = 1
  console.log('2', property)
  console.log('3', property)
}

test()
// Output:
// 1 [Function: property]
// 2 1
// 3 1
```

5. 常见 error 类型
- 编译时 error：SyntaxError（可以简单理解为语法错误
- 运行时 error：RangeError（常见于栈溢出）、ReferenceError、TypeError

6. try catch
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch
- '任何给定的异常只会被离它最近的封闭 catch 块捕获一次。当然，在“inner”块抛出的任何新异常（因为 catch 块里的代码也可以抛出异常），将会被“outer”块所捕获。'（注意最近的封闭 catch；catch 中也可以 throw 错误
- 只有 finally 中的 return 才有效果（finally 存在的情况下

```JavaScript
// catch 中再次抛出错误
try {
  try {
    throw new Error("oops");
  } catch (ex) {
    console.error("inner", ex.message);
    throw ex;
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}

// Output:
// "inner" "oops"
// "finally"
// "outer" "oops"

// finally return
// '如果从finally块中返回一个值，那么这个值将会成为整个try-catch-finally的返回值，无论是否有return语句在try和catch中。这包括在catch块里抛出的异常。'
try {
  try {
    throw new Error("oops");
  } catch (ex) {
    console.error("inner", ex.message);
    throw ex;
  } finally {
    console.log("finally");
    return;
  }
} catch (ex) {
  console.error("outer", ex.message);
}

// 注：此 try catch 语句需要在 function 中运行才能作为函数的返回值，否则直接运行会报语法错误
// Output:
// "inner" "oops"
// "finally"
```
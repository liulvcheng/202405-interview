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
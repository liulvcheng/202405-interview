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
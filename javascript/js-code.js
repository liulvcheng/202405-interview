// 01 - 闭包实现计数器
function add(n) {
  // 返回一个闭包函数，n 为 10 被函数记住
  return function () {
    // console.log('n', n)
    let result = n++
    // console.log('result', result)
    return result
  }
}
const counter = add(10)
counter()
counter()
counter()

// 02 - 睡眠函数
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
let t = Date.now()
// sleep(1000).then(() => console.log('res', Date.now() - t))

// 03 - 实现 at(-1) or 数组最后一个元素
function last(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return -1
  }
  return arr[arr.length - 1]
}
// const result1 = last([1, 2, 3])
// const result2 = last([])
// const result3 = last(undefined)
// console.log('result1', result1)
// console.log('result2', result2)
// console.log('result3', result3)

// 04 - 实现 Array 上的 selfLast 方法
Array.prototype.selfLast = function () {
  const length = this?.length
  return length ? this[length - 1] : -1
}
// const result1 = [(1, 2, 3, 4)].selfLast()
// const result2 = [].selfLast()
// console.log('result1', result1)
// console.log('result2', result2)

// 05 - 对参数进行多次函数调用
function composeFunction(functions) {
  // functions 作为闭包变量保存
  return function (x) {
    functions.reverse().forEach((element) => {
      x = element(x)
    })
    return x
  }
}
const resultFunc = composeFunction([(x) => x + 1, (x) => x + 1, (x) => x + 1])
// console.log(resultFunc(10))

// 06 - 实现 filter
function filterFunc(arr, fn) {
  let result = []
  // 遍历 arr，对 arr 的每一项执行 fn，看是否满足条件
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      result.push(arr[i])
    }
  }
  return result
}
// console.log('1', filterFunc([1, 2, 3, 4, 5], x => x > 4))

// 07 - 转换 arr 的每一项
function transformFunc(arr, fn) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]))
  }
  return result
}
// console.log(transformFunc([1, 2, 3], (x) => Math.pow(x, 2)))

// 08 - 对于 n 来言，n 为每次 n - 1 平方的和
function getNum(n) {
  if (n < 0) {
    return []
  }
  let result = []
  for (let i = 1; i <= n; i++) {
    let sum = 0
    for (let j = 1; j < i; j++) {
      sum += Math.pow(j, 2)
    }
    result.push(sum)
  }
  return result
}
// console.log('here', getNum(5)) // 0 1 5 14 30 55
// 1 - 0 - 0
// 2 - 1 - 1 的平方
// 3 - 5 - 1 的平方 + 2 的平方

// 09 - 类
class Parent {
  constructor(a) {
    this.a = a
  }
  getA() {
    return this.a
  }
  setA(a) {
    this.a = a
  }
}
class Child1 {
  static main() {
    let list = []
    const parent = new Parent()
    for (let item of [1, 2, 3, 4]) {
      // 每次 setA 传入的 item 虽然不一样，但是 list.push 进去的 parent 是同一个
      // 所以可以理解为，每一次 setA 都将之前 push 进去的 parent 对应的 a 设置为新的值（最后即是 4）
      parent.setA(item)
      list.push(parent)
    }
    console.log('here1', list) // [ Parent { a: 4 }, Parent { a: 4 }, Parent { a: 4 }, Parent { a: 4 } ]

    let result = []
    for (let item of list) {
      result.push(item.getA()) // 4 4 4 4
    }
    console.log('here1', result)
  }
}
Child1.main()

class Child2 {
  static main() {
    let list = []
    for (let item of [1, 2, 3, 4]) {
      // const parent = new Parent(item)
      const parent = new Parent()
      parent.setA(item)
      list.push(parent)
    }
    console.log('here2', list) // 打印 [Parent { a: 1 }, Parent { a: 2 }, Parent { a: 3 }, Parent { a: 4 }]

    let result = []
    for (let item of list) {
      result.push(item.getA()) // [1, 2, 3, 4]
    }
    console.log('here2', result)
  }
}
Child2.main()

// 10 - 反转字符串并首字母大写且通过下划线连接
let str = 'world hello'
let strArr = str.split(' ')
const arr = strArr.reverse().map((item) => {
  return item.charAt(0).toUpperCase() + item.slice(1)
})
// console.log('arr', arr.join('_'))

// 10 - 每次花钱的二分之一并减去一块钱，在 n 次后剩下一块钱，求最开始的钱有多少
function getMoneyNum(n) {
  let remain = 1
  for (let i = 1; i <= n; i++) {
    remain = (remain + 1) * 2
  }
  return remain
}
// console.log(getMoneyNum(1))
// console.log(getMoneyNum(2))
// console.log(getMoneyNum(3))
// console.log(getMoneyNum(4))
// console.log(getMoneyNum(5))

// 11 - Promise
function promise() {
  return new Promise((resolve, reject) => {
    resolve(100)
  })
}
// then、catch 可以链式调用
promise()
  .then((res1) => {
    // console.log('res1', res1) // res1 100
    return Promise.resolve(200)
  })
  .then((res2) => {
    // console.log('res2', res2) // res2 200
    return Promise.reject(300)
  })
  .catch((err1) => {
    // console.log('err1', err1) // err1 300
    return Promise.reject(400)
  })
  .catch((err2) => {
    // console.log('err2', err2) // err2 400
    return Promise.resolve(500)
  })
  .then((res3) => {
    // console.log('res3', res3) // res3 500
    // 没有显性指定（指没有 return 语句或者 return 后没有返回东西的情况）返回值时默认返回 undefined
  })
  .then((res4) => {
    // console.log('res4', res4) // res4 undefined
    throw new Error('res5 error')
  })
  .catch((err5) => {
    // console.log('err5', err5) // Error: res5 error
  })

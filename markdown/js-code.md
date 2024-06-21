### 深拷贝
```JavaScript
function cloneDeep(value) {
  const map = new Map()

  function _cloneDeep(value) {
    // 注意 typeof null === 'object'
    const isObject = typeof value === 'object' && value !== null

    // 递归退出条件
    if (!isObject) return value

    if (map.has(value)) {
      return map.get(value)
    }

    const clone = Array.isArray(value) ? [] : {}
    for (const [key, val] of Object.entries(value)) {
      // 递归处理
      clone[key] = _cloneDeep(val)
    }
    map.set(value, clone)
    return clone
  }

  return _cloneDeep(value)
}
const testDataOne = cloneDeep({
  name: 'name',
  value: { name: 'name 01', value: { name: 'name 02', value: 'value' } },
})
const testDataTwo = cloneDeep(111)
const testDataThree = cloneDeep([1, 2, 3, [4, 5, [6, 7]]])
console.log('testDataOne', testDataOne)
console.log('testDataTwo', testDataTwo)
console.log('testDataThree', testDataThree)
```

# 获取 array 最后一个元素
```JavaScript
Array.prototype.getLastArayItem = function () {
  const arrayLength = this?.length
  return arrayLength ? this[arrayLength - 1] : -1
}
console.log('222', [undefined].getLastArayItem())
console.log('333', [1, { name: 'yo' }].getLastArayItem())

// counter 计数器
var createCounter = function (n) {
  return function () {
    let resultNum = n++
    console.log('resultNum', resultNum)
    return resultNum
  }
}
function createCounter(n) {
  return function () {
    let resultNum = n++
    console.log('resultNum', resultNum)
    return resultNum
  }
}
const counter = createCounter(10)
console.log('counter', counter)
counter()
counter()
counter()
```

### 睡眠函数
```JavaScript
function sleep(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
}
async function sleep(millis) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
}
let t = Date.now()
sleep(100).then(() => {
  console.log('time delay', Date.now() - t)
})
```

### 手写 reduce
```JavaScript
let nums = [1, 2, 3, 4]
const count = nums.reduce((pre, cur) => {
  return pre + cur
}, 0)
console.log('count 111', count)

function selfReduce(init, nums) {
  if (!nums?.length) {
    return init
  }
  return selfReduce(init + nums[0], nums.slice(1))
}
const result = selfReduce(0, nums)
console.log('result 222', result)
```

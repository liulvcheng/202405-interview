### sleep
- solution: https://leetcode.cn/problems/sleep/solutions/2506139/shui-mian-han-shu-by-leetcode-solution-vuse/

```JavaScript
/**
 * @param {number} millis
 * @return {Promise}
 */
async function sleep(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, millis)
  })
}

/** 
 * let t = Date.now()
 * sleep(100).then(() => console.log(Date.now() - t)) // 100
 */
```

### 数组最后一个元素
- arr[arr.length - 1]
- at(-1)
```JavaScript
/**
 * @return {null|boolean|number|string|Array|Object}
 */
Array.prototype.last = function() {
  const arrLength = this?.length
  return arrLength ? this[arrLength - 1] : -1
};

/**
 * const arr = [1, 2, 3];
 * arr.last(); // 3
 */
```

### counter 计数器
```JavaScript
/**
 * @param {number} n
 * @return {Function} counter
 */
var createCounter = function(n) {
  return function() {
    return n++
  };
};

/** 
 * const counter = createCounter(10)
 * counter() // 10
 * counter() // 11
 * counter() // 12
 */
```

### 复合函数
```JavaScript
// 可以使用 reduceRight（reduce 反向
/**
 * @param {Function[]} functions
 * @return {Function}
 */
var compose = function(functions) {
	return function(x) {
    functions.reverse().forEach((item) => {
      x = item(x)
    })
    return x
  }
};

/**
 * const fn = compose([x => x + 1, x => 2 * x])
 * fn(4) // 9
 */
```

### 过滤数组中的元素（实现 filter
```JavaScript
/**
 * @param {number[]} arr
 * @param {Function} fn 接受 item or index 作为参数
 * @return {number[]}
 */
var filter = function(arr, fn) {
  let resultArr = []
  arr.forEach((item, index) => {
    if (fn(item, index)) [
      resultArr.push(item)
    ]
  })
  return resultArr
};
```

### 转换数组中的每个数
- forEach、map、for of、for in
```JavaScript
// for of 拿到 index（解构赋值时 index 在前、value 在后
const arr = ['a', 'b', 'c'];

for (const [index, value] of arr.entries()) {
  console.log(`${index}: ${value}`);
}
```

### 计数器
```JavaScript
/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
var createCounter = function(init) {
  // 定义临时变量，操作只针对于该变量
  let currentInit = init
  return {
    increment: () => ++currentInit,
    decrement: () => --currentInit,
    reset: () => currentInit = init
  }
};

/**
 * const counter = createCounter(5)
 * counter.increment(); // 6
 * counter.reset(); // 5
 * counter.decrement(); // 4
 */
```

### toBe and notToBe
```JavaScript
/**
 * @param {string} val
 * @return {Object}
 */
var expect = function(val) {
  return {
    toBe: (item) => {
      if (val !== item) throw new Error('Not Equal')
      return true
    },
    notToBe: (item) => {
      if (val === item) throw new Error('Equal')
      return true
    }
  }
};

/**
 * expect(5).toBe(5); // true
 * expect(5).notToBe(5); // throws "Equal"
 */
```

### 函数记忆化
- https://leetcode.cn/problems/memoize/description/?envType=study-plan-v2&envId=30-days-of-javascript
- 利用 obj or map 中 key 的唯一性
```JavaScript
/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
    const map = new Map()
    return function(...args) {
      const item = JSON.stringify(args)
      if (!map.has(item)) {
        map.set(item, fn(...args))
      }
      return map.get(item)
    }
}

function memoize(fn) {
    const cache = {}
    return function(...args) {
      const item = JSON.stringify(args)
      if (item in cache) {
        return cache[item]
      }
      const result = fn(args)
      cache[item] = result
      return result
    }
}


/** 
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *	 callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1 
 */
```

### debounce
- link：https://leetcode.cn/problems/debounce/submissions/533271284/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Function} fn
 * @param {number} t milliseconds
 * @return {Function}
 */
 // t 时间后才执行函数，t 时间之内的重复调用都被 cancel
var debounce = function(fn, t) {
    let timeId = null
    return function(...args) {
      if (timeId) {
        clearTimeout(timeId)
      }
      timeId = setTimeout(() => fn(...args), t)
    }
};

/**
 * const log = debounce(console.log, 100);
 * log('Hello'); // cancelled
 * log('Hello'); // cancelled
 * log('Hello'); // Logged at t=100ms
 */
```

### 并行执行异步函数
- link：https://leetcode.cn/problems/execute-asynchronous-functions-in-parallel/description/?envType=study-plan-v2&envId=30-days-of-javascript
- 模拟 Promise.all()
```JavaScript
/**
 * @param {Array<Function>} functions
 * @return {Promise<any>}
 */
var promiseAll = function(functions) {
    return new Promise((resolve, reject) => {
      const length = functions.length

      // 边界情况处理
      if (!length) {
        return resolve([])
      }

      let resolveList = new Array(length).fill(null)
      let resolveCount = 0
      functions.forEach(async (item, index) => {
        try {
          const data = await item()
          resolveList[index] = data
          resolveCount++
          if (resolveCount === length) {
            resolve(resolveList)
          }
        } catch(error) {
          reject(error)
        }

      })
    })
};

/**
 * const promise = promiseAll([() => new Promise(res => res(42))])
 * promise.then(console.log); // [42]
 */
```

### 判断对象是否为空
link：https://leetcode.cn/problems/is-object-empty/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Object|Array} obj
 * @return {boolean}
 */
var isEmpty = function(obj) {
  // 数组
  if (Array.isArray(obj)) {
    return !obj.length
  }
  // 对象
  if (typeof obj === 'object') {
    return !Object.keys(obj).length
  }
};
```

### 分块数组
- link：https://leetcode.cn/problems/chunk-array/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Array} arr
 * @param {number} size
 * @return {Array}
 */
// silce
var chunk = function(arr, size) {
  const result = []
  let index = 0
  while (index < arr.length) {
    result.push(arr.slice(index, index + size))
    index += size
  }
  return result
};

// splice
var chunk = function(arr, size) {
  const result = []
  while (arr.length > 0) {
    result.push(arr.slice(0, size))
  }
  return result
}
const chunkFunc = chunk
chunkFunc([1, 2, 3, 4, 5], 1)
chunkFunc([1, 2, 3, 4, 5], 5)
chunkFunc([1, 2, 3, 4, 5], 6)
```

### 实现 groupBy
- link：https://leetcode.cn/problems/group-by/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Function} fn
 * @return {Object}
 */
Array.prototype.groupBy = function (fn) {
  let obj = {};
  // 利用 obj key 的唯一性
  for (let item of this) {
    const key = fn(item);
    if (key in obj) {
      obj[key].push(item);
    } else {
      // 注意这里新值需要初始化为数组
      obj[key] = [item];
    }
  }
  return obj;
};

// { false: [ 1, 2, 3, 4, 5 ], true: [ 6, 7, 8, 9, 10 ] }
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].groupBy((n) => {
  return String(n > 5);
});
```

### 根据 id 合并数组
- link：https://leetcode.cn/problems/join-two-arrays-by-id/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
var join = function (arr1, arr2) {
  let arr1ToObj = {}
  for (let item of arr1) {
    arr1ToObj[item.id] = item
  }
  for (let item of arr2) {
    // arr2 的重复项覆盖 arr1 的重复项
    arr1ToObj[item.id] = { ...arr1ToObj[item.id], ...item }
    or
    arr1ToObj[item.id] = Object.assign(arr1ToObj[item.id] ?? {}, item)
  }
  return Object.values(arr1ToObj)
};
```

### 实现扁平化函数 flat
- link：https://leetcode.cn/problems/flatten-deeply-nested-array/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Array} arr
 * @param {number} depth
 * @return {Array}
 */
var flat = function (arr, n) {
  if (n === 0) {
    return arr
  }
  let result = []
  const flatFunc = (nums, level) => {
    for (const num of nums) {
      // 该项仍旧为 array 且层级大于 0 时递归调用该函数，层级减 1
      // level > 0 用来判断需要扁平化的层次
      if (Array.isArray(num) && level > 0) {
        flatFunc(num, level - 1)
      } else {
        result.push(num)
      }
    }
  }
  flatFunc(arr, n)
  return result
};
```

### 实现 Array.prototype.flat()
- link：https://bigfrontend.dev/zh/problem/implement-Array-prototype.flat
```JavaScript
// depth 展开深度默认 1
function flat(arr, depth = 1) {
  let result = []
  arr.forEach((item) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, depth - 1))
    } else {
      result.push(item)
    }
  })
  return result
}

function flat(arr, depth = 1) {
  return depth ? arr.reduce((pre, cur) => {
    return [...pre, ...(Array.isArray(cur) ? flat(cur, depth - 1) : [cur])]
  }, []) : arr;
}

// 扩展 Array 方法
Array.prototype.flatDefault = function (depth = 1) {
  return depth
    ? this.reduce((pre, cur) => {
        return [
          ...pre,
          ...(Array.isArray(cur) ? cur.flatDefault(depth - 1) : [cur]),
        ]
      }, [])
    : this
}

// 默认 Infinity
Array.prototype.flatDefault = function (depth = 1) {
  return this.reduce((pre, cur) => {
    return [
      ...pre,
      ...(Array.isArray(cur) ? cur.flatDefault() : [cur]),
    ]
  }, [])
}
```

### 精简对象
- link：https://leetcode.cn/problems/compact-object/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {Object|Array} obj
 * @return {Object|Array}
 */
var compactObject = function (obj) {
  // 边界情况
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // array
  if (Array.isArray(obj)) {
    const res = []
    for (let item of obj) {
      const val = compactObject(item)
      if (val) {
        res.push(val)
      }
    }
    return res
  }

  // object
  const res = {}
  const keys = Object.keys(obj)
  for (let key of keys) {
    const val = compactObject(obj[key])
    if (val) {
      res[key] = val
    }
  }
  return res
};

const func = compactObject
console.log('here', func([null, 0, 5, [0], [false, 10]])) // [ 5, [], [ 10 ] ]
```

### 包装数组
- link：https://leetcode.cn/problems/array-wrapper/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
/**
 * @param {number[]} nums
 * @return {void}
 */
var ArrayWrapper = function(nums) {
  this.nums = nums
};

/**
 * @return {number}
 */
ArrayWrapper.prototype.valueOf = function() {
  return this.nums.reduce((pre, cur) => {
    return pre += cur
  }, 0)
}

/**
 * @return {string}
 */
ArrayWrapper.prototype.toString = function() {
  return `[${this.nums.join(',')}]`
}

/**
 * const obj1 = new ArrayWrapper([1,2]);
 * const obj2 = new ArrayWrapper([3,4]);
 * obj1 + obj2; // 10
 * String(obj1); // "[1,2]"
 * String(obj2); // "[3,4]"
 */
```

### 使用方法链（链式调用）的计算器
- link：https://leetcode.cn/problems/calculator-with-method-chaining/description/?envType=study-plan-v2&envId=30-days-of-javascript
```JavaScript
// 需要 return this 才可以链式调用
class Calculator {
  /** 
   * @param {number} value
   */
  constructor(value) {
    this.value = value
  }

  /** 
   * @param {number} value
   * @return {Calculator}
   */
  add(value) {
    this.value += value
    return this
  }

  /** 
   * @param {number} value
   * @return {Calculator}
   */
  subtract(value) {
    this.value -= value
    return this
  }

  /** 
   * @param {number} value
   * @return {Calculator}
   */
  multiply(value) {
    this.value *= value
    return this
  }

  /** 
   * @param {number} value
   * @return {Calculator}
   */
  divide(value) {
    if (value === 0) {
      throw new Error('Division by zero is not allowed')
    }
    this.value /= value
    return this
  }

  /** 
   * @param {number} value
   * @return {Calculator}
   */
  power(value) {
    this.value **= value
    return this
  }

  /** 
   * @return {number}
   */
  getResult() {
    return this.value
  }
}
```

### 数加一
1. BigInt 可以处理 Number 越界问题
```JavaScript
/**
 * @param {number[]} digits
 * @returns {number[]}
 */
function plusOne(digits) {
  // digits 先转为数字加一在转为数组
  return `${BigInt(digits.join('')) + 1n}`.split('');
  // Number 处理数字越界
  // return `${Number(digits.join('')) + 1}`.split('');
}

// Number 处理数字越界
const num = Number(
  [6, 1, 4, 5, 3, 9, 0, 1, 9, 5, 1, 8, 6, 7, 0, 5, 5, 4, 3].join('')
)
console.log(num) // => 614 5390 1951 8670 5000
console.log(num > Number.MAX_SAFE_INTEGER) // => true 即 Number 能处理的数字超过了最大安全数字
console.log(Number.MAX_SAFE_INTEGER) // => 9007 1992 5474 0991
```
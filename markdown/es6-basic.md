### 3 - 变量的解构赋值
1. 数组解构
```JavaScript
// 对 set 解构
let [x, y, z] = new Set(['a', 'b', 'c']);

// 默认值引用其他变量
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

2. 对象解构
- 模式匹配
```JavaScript
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

- 数组是特殊的对象
```JavaScript
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr = [ 0: 1, 1: 1, 2: 3 ];
first // 1
last // 3
```

- 如何改变对象的原型
```JavaScript
// Object.create()：obj 的原型是 proto
const proto = { foo: 'bar' };
const obj = Object.create(proto);
console.log(obj.foo); // 输出 'bar'

// 直接改变 __proto__ 属性
const proto = { foo: 'bar' };
const obj = {};
obj.__proto__ = proto;
console.log(obj.foo); // 输出 'bar'

// 类继承
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}
class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}
// d 是 Dog 类的实例
const d = new Dog('Mitzie');
d.speak(); // 输出 'Mitzie barks.'

// setPrototypeOf
class Person {
  constructor(name, age, sex) {
    Object.assign(this, { name, age, sex })
    // 等价于
    // this.name = name
    // this.age = age
    // this.sex = sex
  }
  greet() {
    console.log(`Hello, my name is ${this.name}`)
  }
}
const liu = new Person('liu', 18, 'male')
console.log(Object.getPrototypeOf(liu)) // {}（即 Person 类型
Object.setPrototypeOf(liu, { name: 'default', age: 999, sex: 'default' })
console.log(Object.getPrototypeOf(liu)) // { name: 'default', age: 999, sex: 'default' }
```

3. 字符串解构
```JavaScript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
```

4. 解构赋值的规则：'解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错'
```JavaScript
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

5. 解构赋值的用户
- 函数参数的默认值
```JavaScript
// 避免了在函数体内部再写 var foo = config.foo || 'default foo' 这样的语句（实际上这样的语句赋值是有问题的）
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

### 4 - 字符串的扩展
1. 模版字符串中调用函数
```JavaScript
function fn() {
  return "Hello World";
}
`foo ${fn()} bar` // foo Hello World bar
```

### 5 - 字符串的新增方法
1. 新的实例方法：includes、startsWith、endsWith
```JavaScript
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

// 支持第二个参数
let s = 'Hello world!';
s.startsWith('world', 6) // true（从 6 到结束
s.endsWith('Hello', 5) // true（从 0 到 6
s.endsWith('Hello', 1) // false（从 0 到 1
s.includes('Hello', 6) // false（从 5 到结束

// includes 是全等
console.log([1, 2, 3].includes(1)) // true
console.log([1, 2, 3].includes('1')) // false
```

2. 新的实例方法：repeat
```JavaScript
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
```

3. 新的实例方法：padStart、padEnd
```JavaScript
// 参数 1：最大长度；参数 2：用来补全的字符串
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

4. 新的实例方法：trimStart、trimEnd

5. replace、replaceAll
```JavaScript
'aabbcc'.replace('b', '_')
// 'aa_bcc'

'aabbcc'.replace(/b/g, '_')
// 'aa__cc'

'aabbcc'.replaceAll('b', '_')
// 'aa__cc'
```

6. at
```JavaScript
console.log([1, 2, 3].at(-1)) // 3
console.log([1, 2, 3].at(-3)) // 1
console.log([1, 2, 3].at(0)) // 1
console.log('123'.at(-1)) // 3
console.log('123'.at(0)) // 1
console.log('123'.at(-3)) // 1
```

### 7 - 数值的扩展
1. Number.isFinite、Number.isNaN
- 上述两个新 api 相较于 isFinite、isNaN 都更精确
```JavaScript
isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false

isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
Number.isNaN(1) // false
```

2. Math.trunc
```JavaScript
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
```

### 8 - 函数的扩展
1. name 属性
```JavaScript
function handler() {
  console.log('1')
}
console.log(handler.name) // handler

const func = function () {
  console.log('2')
}
console.log(func.name) // func（es5 中会返回空字符串
```

2. 尾调用、尾递归

### 9 - 数组的扩展
1. rest（剩余参数） 和 spread（扩展运算符）
```JavaScript
// rest
function func1(...nums) {
  console.log(nums)
}
func1(1, 2, 3) // [1, 2, 3]

// sperad
function func2(nums) {
  console.log(...nums)
}
func2([1, 2, 3]) // 1 2 3
```

- 扩展运算符代替 apply
```JavaScript
// ES5 的写法
Math.max.apply(null, [14, 3, 77])
// ES6 的写法
Math.max(...[14, 3, 77])
// 等同于
Math.max(14, 3, 77);

// ES5 的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);
// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
```

2. Array.from
- 任何有 length 属性的对象，都可以通过 Array.from() 方法转为数组
```JavaScript
Array.from({ length: 3 }) // [ undefined, undefined, undefined ]

// 返回数据类型
function typesOf () {
  return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
```

3. Array.of
```JavaScript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

4. find、findLast、findIndex、findLastIndex
```JavaScript
[1, 4, -5, 10].find((n) => n < 0)
// -5

[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```

5. keys()、values()、entries()
```JavaScript
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

// 手动调用 next 方法
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

6. toReverse、toSorted、toSpliced、with
- 下述四种方法都不会改变原数组
```JavaScript
const sequence = [1, 2, 3];
sequence.toReversed() // [3, 2, 1]
sequence // [1, 2, 3]

const outOfOrder = [3, 1, 2];
outOfOrder.toSorted() // [1, 2, 3]
outOfOrder // [3, 1, 2]

const array = [1, 2, 3, 4];
array.toSpliced(1, 2, 5, 6, 7) // [1, 5, 6, 7, 4]
array // [1, 2, 3, 4]

const correctionNeeded = [1, 1, 3];
correctionNeeded.with(1, 2) // [1, 2, 3]
correctionNeeded // [1, 1, 3]
```

### 10 - 对象的扩展
1. 对象中控制每个字段的属性
```JavaScript
// writeable（是否可以被修改）、enumerable（是否可以被某些遍历方法枚举遍历）、configurable（属性描述符自身「自身指前面三者」是否可以被修改；属性是否可以被删除）
const obj = {
  name: 'liu',
  age: 18,
}
console.log(Object.getOwnPropertyDescriptors(obj))
// {
//   name: {
//     value: 'liu',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   age: { value: 18, writable: true, enumerable: true, configurable: true }
// }

// configurable
const obj = {};

Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: true // 该属性描述符是可配置的
});
// 可以删除属性
delete obj.name;
console.log(obj.name); // 输出: undefined (属性已被删除)

Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: false // 该属性描述符不可配置
});
// 不能删除属性
delete obj.name;
console.log(obj.name); // 输出: John (属性未被删除)
// 尝试修改描述符
Object.defineProperty(obj, 'name', {
  writable: false
});
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// 输出: { value: 'John', writable: false, enumerable: true, configurable: false }

// 不能再修改描述符
try {
  Object.defineProperty(obj, 'name', {
    enumerable: false
  });
} catch (e) {
  console.error(e); // TypeError: Cannot redefine property: name
}

// 综合例子
const obj = {};
Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: true
});
// 可写
obj.name = 'Doe';
console.log(obj.name); // 输出: Doe
// 可枚举
console.log(Object.keys(obj)); // 输出: ['name']
for (let key in obj) {
  console.log(key); // 输出: name
}
// 可配置
Object.defineProperty(obj, 'name', {
  value: 'Jane',
  writable: false
});
console.log(obj.name); // 输出: Jane
delete obj.name;
console.log(obj.name); // 输出: undefined (属性已被删除)
```

2. super 关键字
- 'this 关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字 super，指向当前对象的原型对象；super 关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错'
```JavaScript
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

// setPrototypeOf 设置 obj 的原型为 proto
Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

3. 解构赋值
```JavaScript
// 合并
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);

// 参数覆盖
let aWithOverrides = { ...a, x: 1, y: 2 };
// 等同于
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } };
// 等同于
let x = 1, y = 2, aWithOverrides = { ...a, x, y };
// 等同于
let aWithOverrides = Object.assign({}, a, { x: 1, y: 2 });
```

### 11 - 对象的新增方法
1. Object.is
```JavaScript
NaN === NaN // false
Object.is(NaN, NaN) // true
Object.is({}, {}) // false
```

2. Object.assign
- 拷贝为浅拷贝
- Object.assign() 拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）
- 属性名为 Symbol 值的属性，也会被 Object.assign() 拷贝
```JavaScript
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// { b: 'c' }

Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })
// { a: 'b', Symbol(c): 'd' }

// 数组
console.log(Object.assign([1, 2], [3, 4])) // [3, 4]
console.log(Object.assign([0: 1, 1: 2], [0: 3, 1: 4])) // [3, 4]

// Object.assign 在构造函数中的使用
class Person {
  constructor(name, age, sex) {
    Object.assign(this, { name, age, sex })
    // 等价于
    // this.name = name
    // this.age = age
    // this.sex = sex
  }
}
const liu = new Person('liu', 18, 'male')
console.log(liu) // { name: 'liu', age: 18, sex: 'male' }
```

- 克隆对象
```JavaScript
// 克隆原始对象自身
function clone(origin) {
  return Object.assign({}, origin);
}

// 克隆原始对象自身及其继承的
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
```

3. getPrototypeOf、setPrototypeOf
- 读取对象的原型：__proto__、getPrototypeOf（更现代）
- 设置对象的原型：__proto__、setPrototypeOf（更现代）

4. Object.keys()，Object.values()，Object.entries()
```JavaScript
const obj = { name: 'liu', age: 999 }
console.log(Object.entries(obj)) // [ [ 'name', 'liu' ], [ 'age', 999 ] ]
```

5. Object.hasOwn、实例.hasOwnProperty
```JavaScript
// 均可以用来判断对象是否具有自有属性
const foo = Object.create({ a: 123 })
foo.b = 456

console.log(Object.hasOwn(foo, 'a')) // false（a 在 foo 的原型上
console.log(Object.hasOwn(foo, 'b')) // true

console.log(foo.hasOwnProperty('a')) // false（a 在 foo 的原型上
console.log(foo.hasOwnProperty('b')) // true
```

### 12 - 运算符的扩展
1. 可选链操作符
```JavaScript
a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.b()
// 等同于
a == null ? undefined : a.b()

a?.()
// 等同于
a == null ? undefined : a()
```

2. ??
```JavaScript
const animationDuration = response.settings?.animationDuration ?? 300;
```

### 13 - Symbol
1. 相等判断
```JavaScript
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();
s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');
s1 === s2 // false
```

2. Symbol.prototype.description
```JavaScript
// 之前
const sym = Symbol('foo');
String(sym) // "Symbol(foo)"
sym.toString() // "Symbol(foo)"

// 之后
const sym = Symbol('foo');
sym.description // "foo"
```

3. Symbol 属性名的遍历
```JavaScript
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]

// for...in、getOwnPropertyNames、getOwnPropertySymbols
const obj = {};
const foo = Symbol('foo');

obj[foo] = 'bar';

for (let i in obj) {
  console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj) // []
Object.getOwnPropertySymbols(obj) // [Symbol(foo)]
```

4. Reflect.ownKeys
```JavaScript
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```

5. Symbol.for
```JavaScript
Symbol.for("bar") === Symbol.for("bar")
// true
Symbol("bar") === Symbol("bar")
// false

let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s1 === s2 // true

// Symbol.for 是在全局环境下的
function foo() {
  return Symbol.for('bar');
}

const x = foo();
const y = Symbol.for('bar');
console.log(x === y); // true
```

6. Symbol.keyFor
- 获取定义 Symbol 添加的 key（即 description）
```JavaScript
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

### 14 - Set、Map
1. Set 定义
```JavaScript
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```

2. Set 操作方法
```JavaScript
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2) // true
s.has(2) // false
```

3. Set 遍历方法
- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员
```JavaScript
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

4. 遍历的同时改变 Set 结构
```JavaScript
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```

5. Map
```JavaScript
// 指定数组作为初始参数
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"

// 上述赋值可类比如下
const items = [
  ['name', '张三'],
  ['title', 'Author']
];
const map = new Map();
items.forEach(
  ([key, value]) => map.set(key, value)
);
```

6. (Array、Map、Set) to Map
```JavaScript
const arr = [
  [1, 1],
  [2, 2],
]

// 数组生成 Map
const map1 = new Map(arr)
console.log(map1) // Map(2) { 1 => 1, 2 => 2 }

const set = new Set([
  [3, 3],
  [4, 4],
])
console.log(set) // Set(2) { [ 3, 3 ], [ 4, 4 ] }

// Set 生成 Map
const map2 = new Map(set)
console.log(map2) // Map(2) { 3 => 3, 4 => 4 }

// Map 生成 Map
const map3 = new Map(map2)
console.log(map3) // Map(2) { 3 => 3, 4 => 4 }
```

7. Map 键的问题
- Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名
```JavaScript
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

8. Map 的遍历
- Map.prototype.keys()：返回键名的遍历器
- Map.prototype.values()：返回键值的遍历器
- Map.prototype.entries()：返回所有成员的遍历器
- Map.prototype.forEach()：遍历 Map 的所有成员
```JavaScript
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// Map 结构转数组
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
[...map.keys()]
// [1, 2, 3]
[...map.values()]
// ['one', 'two', 'three']
[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]
[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

### 15 - Proxy
1. 拦截默认行为
```JavaScript
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35

// 访问对象上不存在的属性
var person = {
  name: "张三"
};
var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      // 不存在时抛出 error（原来是返回 undefined
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});
proxy.name // "张三"
proxy.age // 抛出一个错误
```

2. Proxy 代理实现数组访问负数下标（拦截 get 操作
```JavaScript
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

// a、b、c：正序坐标（0、1、2），反序坐标（-1、-2、-3）
let arr = createArray('a', 'b', 'c');
arr[-1] // c
```

3. 设置属性的值范围（拦截 set
- 对 set 的拦截需要返回 true、false（返回 false 表示设置不成功，在 use strict 严格模式下会有不同，非严格模式下属性还是会设定成功） 或者抛出 error
```JavaScript
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错

// 设置属性不可被外部读写
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

4. Proxy 的实际应用
- api 请求缓存
```JavaScript
const apiCacheHandler = {
  cache: new Map(),

  async get(target, prop) {
    if (this.cache.has(prop)) {
      console.log(`Returning cached data for ${prop}`);
      return this.cache.get(prop);
    } else {
      const result = await target[prop]();
      this.cache.set(prop, result);
      return result;
    }
  }
};

const api = {
  async fetchData() {
    // 模拟 API 请求
    return new Promise(resolve => setTimeout(() => resolve('API Data'), 1000));
  }
};

const cachedApi = new Proxy(api, apiCacheHandler);

// 第一次请求，会发出真正的 API 请求
cachedApi.fetchData().then(data => console.log(data)); // Output: API Data

// 第二次请求，会使用缓存数据
setTimeout(() => {
  cachedApi.fetchData().then(data => console.log(data)); // Output: API Data
}, 2000);
```

- 编译时表单验证
```JavaScript
const validatorHandler = {
  set(target, prop, value) {
    if (prop === 'age' && (!Number.isInteger(value) || value < 0 || value > 120)) {
      throw new Error('Invalid age');
    }
    target[prop] = value;
    return true;
  }
};

const formData = { name: '', age: 0 };
const validatedData = new Proxy(formData, validatorHandler);

validatedData.name = 'John Doe'; // 正常赋值

try {
  validatedData.age = 'twenty'; // 抛出错误: Invalid age
} catch (error) {
  console.error(error.message);
}

try {
  validatedData.age = 25; // 正常赋值
  console.log(validatedData.age); // Output: 25
} catch (error) {
  console.error(error.message);
}
```

- i18n 库
```JavaScript
const translations = {
  en: { greeting: 'Hello' },
  fr: { greeting: 'Bonjour' },
  es: { greeting: 'Hola' }
};

const i18nHandler = {
  get(target, prop, receiver) {
    if (prop in target) {
      return target[prop];
    } else {
      return `Translation for "${prop}" not found`;
    }
  }
};

const getTranslation = (lang) => new Proxy(translations[lang], i18nHandler);

const en = getTranslation('en');
const fr = getTranslation('fr');

console.log(en.greeting); // Output: Hello
console.log(fr.greeting); // Output: Bonjour
console.log(fr.farewell); // Output: Translation for "farewell" not found
```

### 16 - Reflect
1. 让 Object 操作变成函数行为
```JavaScript
// 老写法
'assign' in Object // true
// 新写法
Reflect.has(Object, 'assign') // true

delete Obj.name
Reflect.deleteProperty(obj, name)
```

2. 用于简化代码（更加简洁方便
- Reflect.get、Reflect.deleteProperty、Reflect.has
```JavaScript
// 有 Reflect
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    // 使用 Reflect.get 执行默认的属性获取操作
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete ' + name);
    // 使用 Reflect.deleteProperty 执行默认的属性删除操作
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has ' + name);
    // 使用 Reflect.has 执行默认的属性存在性检查操作
    return Reflect.has(target, name);
  }
});

// 无 Reflect
let obj = { a: 1, b: 2 };
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    // 手动执行默认的属性获取操作
    return target[name];
  },
  deleteProperty(target, name) {
    console.log('delete ' + name);
    // 手动执行默认的属性删除操作
    return delete target[name];
  },
  has(target, name) {
    console.log('has ' + name);
    // 手动执行默认的属性存在性检查操作
    return name in target;
  }
});
// 访问属性
console.log(loggedObj.a); // 输出：get { a: 1, b: 2 } a  1
// 删除属性
delete loggedObj.b; // 输出：delete b
// 检查属性
console.log('a' in loggedObj); // 输出：has a  true
```

### 17 - Promise
1. success 和 failure 的处理
```JavaScript
// 01
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});

// 02
promise
  .then(() => {})
  .catch(() => {})
```

2. Promise 新建后会立即执行
```JavaScript
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

3. Promise 回调函数返回 Promise
- 返回的 Promise 决定 Promise 的状态
```JavaScript
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

4. Promise 的状态一旦改变就不会再变化
```JavaScript
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  // 下述代码无效果
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

5. Promise.prototype.finally
- 不接受任何参数，适用于与状态无关的操作，不依赖于 Promise 的执行结果

6. Promise.all
```JavaScript
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
// p2 自己实现了 catch 方法
.catch(e => e);
Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]

const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);
Promise.all([p1, p2])
.then(result => console.log(result))
// p2 自己没有 catch 方法，被 Promise.all 的 catch 劫持
.catch(e => console.log(e));
// Error: 报错了
```

7. Promise.race
- 返回的 Promise 将采用第一个解决或拒绝的 Promise 的结果
- 只要有一个传入的 Promise 状态发生改变，无论是 resolve 还是 reject，Promise.race 都会立即返回
```JavaScript
const p = Promise.race([Promise.reject(1), Promise.resolve(2)])
p.then((resolve) => console.log('success', resolve)).catch((reject) =>
  console.log('reject', reject)
)
```

8. 实现当第一个 Promise 被 resolve 时才返回
```JavaScript
function firstResolved(promises) {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    const totalPromises = promises.length;

    promises.forEach(promise => {
      promise.then(resolve).catch(() => {
        rejectedCount++;
        if (rejectedCount === totalPromises) {
          reject(new Error('All promises were rejected'));
        }
      });
    });
  });
}

// 示例
const promise1 = new Promise((resolve, reject) => {
  setTimeout(reject, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, 'two');
});

const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 300, 'three');
});

firstResolved([promise1, promise2, promise3])
  .then(value => {
    console.log('First resolved with value:', value);
  })
  .catch(error => {
    console.log('All promises were rejected:', error.message);
  });
```

9. promise.allSettled
```JavaScript
const promises = [fetch('index.html'), fetch('https://does-not-exist/')]
const results = await Promise.allSettled(promises)

// 过滤出成功的请求
const successfulPromises = results.filter((p) => p.status === 'fulfilled')

// 过滤出失败的请求，并输出原因
const errors = results
  .filter((p) => p.status === 'rejected')
  .map((p) => p.reason)
```

10. Promise.any
- 只要有一个 Promise 成功或者所有 Promise 都失败时才返回
```JavaScript
var resolved = Promise.resolve(42)
var rejected = Promise.reject(-1)
var alsoRejected = Promise.reject(Infinity)

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result) // 42
})

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results instanceof AggregateError) // true
  console.log(results.errors) // [-1, Infinity]
})
```

11. Promise 用于加载图片
```JavaScript
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    // 下面这段代码永远会执行，不管 resolve or reject
    image.src = path;
  });
};
```

12. Promise.try
- 将包裹的内容（不论同步还是异步）转为异步代码从而可以使用 then、catch
- 官方没有实现（推进中），需要引用第三方库来实现
```JavaScript
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// 由于事件循环 next 会先于 now 输出
// next
// now

// 外层 try - catch 处理同步错误；内层 then - catch 处理异步错误
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}

// 上述代码的简化
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

### 26 - 编程风格
1. 使用 let、const 代替 var（全局作用域，变量提升）

2. 变量赋值时优先使用解构赋值
```JavaScript
const arr = [1, 2, 3, 4];
// bad
const first = arr[0];
const second = arr[1];
// good
const [first, second] = arr;

// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
}
// good
function getFullName(obj) {
  const { firstName, lastName } = obj;
}
// best
function getFullName({ firstName, lastName }) {}
```

3. 数组
```JavaScript
// 使用扩展运算符拷贝数组
// bad
const len = items.length;
const itemsCopy = [];
let i;
for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}
// good
const itemsCopy = [...items];

// Array.from 将类数组转为数组
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```
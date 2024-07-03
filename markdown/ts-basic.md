### 什么是 typeScript
1. javaScript + type（对值的约束） + babel（配置、编译兼容旧版本
- 对值的约束可体现在如变量（对其定义类型的约束）、函数（对于入参和返回值类型的约束）

### 初始化定义
1. string、number、boolean...
```
const name: string = 'name'
const age: number = 99
const isMale: boolean = true
```

2. array、object
```
// array
const arrOne: string[] = ['1', '2', '3']
const arrTwo: Array<string> = ['1', '2', '3']

// object（每个字段的类型都需要对应上、且不能多也不能少
interface User {
  name: string,
  age: number,
  favorite: string[],
}
const userForJhon: User = {
  name: 'john',
  age: 10,
  favorite: ['ball', 'ride'],
}
```

3. object 定义时的 interface
- 定义 interface 便于抽象封装、复用；interface 可互相调用
- interface 的继承
  - interface 继承 interface
  - interface 可以继承 type（此处的 type 需要定义为对象的形式）
  - interface 可以继承类（Class）
- interface 合并：同名 interface 会自动合并（注意属性类型需相同）
```TypeScript
// 对象数组（interface + type
interface User {
  name: string,
  age: number,
  favorite: string[],
}
const userList: User[] = [
  {
    name: 'john',
    age: 10,
    favorite: ['ball', 'ride'],
  }
]

// readOnly 只读
interface A {
  readonly a: string,
}

// inter 多重继承
interface Style {
  color: string,
}
interface Shape {
  name: string,
}
// Circle 实际上有三个属性；子类继承父类（包含多个）存在同名属性类型需相同
interface Circle extends Style, Shape {
  radius: number,
}

// interface 继承 type
type TypeOne = {
  name: string,
  age: number
}
interface apiOne extends TypeOne {
  sex: string
}
// 三个属性缺一不可
const obj: apiOne = {
  name: 'name',
  age: 18,
  sex: 'red',
}
```

4. 可选标记
```
interface User {
  name: string,
  age: number,
  favorite: string[],
  // 给 sex 字段添加可选标记（sex 字段可不存在；存在时类型需与定义时一致
  sex?: string,
}
```

5. 枚举（enum）定义
```
// 枚举支持 string、number、构造函数
function generate() {
  return Math.random() * 10000;
}

enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser = 10002,
  // VIPUser、Admin 字段值会自动累加，这里分别为 10003、10004
  VIPUser,
  Admin,
  Mixed = 'Mixed',
  Random = generate(),
  // ...
}
```

6. Set、Map
// Set 类似于 Array，为单个值的 list；Map 类似于 Object（实际组成还是 Array 形式），为 key - value 键值对的数据类型
```
const set = new Set<number>();

set.add(1);
set.add('2'); // X 类型“string”的参数不能赋给类型“number”的参数。

const map = new Map<number, string>();

map.set(1, '1');
map.set('2', '2'); // X 类型“string”的参数不能赋给类型“number”的参数。
```

### 函数声明 and 函数表达式
```
// ...声明（存在函数提升
testFunOne()
function testFunOne () {
  console.log('testFunOne')
}

// ...表达式（不能在声明前使用
testFunTwo()
const testFunTwo = () => {
  console.log('testFunTwo')
}

// js 中函数无返回值时，返回的是 undefined
function testFunThree() {
  return
}
const result = testFunThree()
console.log(result) // undefined

// 无返回值时，ts 中函数返回类型需自定义（void 类型
function handler1(): void {}; // 合法
function handler2(): undefined {}; // 非法

// 无返回值时，ts 中自定义函数返回类型为 undefined
function handler3(): undefined {
  return
}
```

1. 函数类型
```
function testFunOne(num1: number, num2: number): number {
  return num1 + num2
}
testFunOne(1, 1)
```

2. 类型别名
- 类型别名可充当变量或者函数
- 类型别名具有块作用域
```TypeScript
// 类型别名充当变量
type Multiple = string | number | boolean
type Status = 'success' | 'failes'
type Sum = (a: number, b: number) => number

// 类型别名充当函数
type Status<T> = 'success' | 'failure' | 'pending' | T
type CompleteStatus = Status<'offline'>


// 类型别名（使用该别名创建函数声明时会进行自动推导
type Sum = (a: number, b: number) => number
const testFunTwo: Sum = (a, b) => {
  return a + b
}
testFunTwo(1, 1)

// 类型别名定义格式；类型别名定义入参和返回值推导需要符合类型推导规则（如 number 相加操作无法推导出 string
type customType = (params1: type, params2: type) => type // 合法
type customType = (a: number, b: number) => boolean // 非法

// 联合类型
type multipleType = string | number | boolean // 以上三种类型都合法
let num: multipleType = 99
num = '99'
num = true

// 交叉类型
type sameType = string & number & boolean // 以上三种类型需同时满足才合法（实际上并不存在这种类型

// 联合类型块作用域（两个 Color 类型不相同
type Color = 'red'

if (Math.random() < 0.5) {
  type Color = 'blue'
}

// 联合、交叉类型作用于基本类型和对象类型之间的差别
// 基本类型
type A = number | string
type B = boolean | string
type C = A & B // string
type D = A | B // number | string | boolean

// 对象类型
type A1 = { name: string, age: number }
type B1 = { name: string, sex: string }
type C1 = A1 & B1 // { name: string, age: number, sex: string }
type D1 = A1 | B1 // { name: string, age: number } | { name: string, sex: string }
```

3. 字面量类型 or 字面量联合、交叉类型（通过类型别名更严格的定义类型
```
type Status = 'success' | 'failed' // 只能是 'success' or 'failed'（比 string 类型更具体
type statusCode = 200 | 201 | 202
const fetchStatus: Status = 'success' or 'failed'
```

4. 联合 or 交叉类型与 interface 的结合
```
interface apiOne {}
interface apiTwo {}
interface apiThree {}

type multipleType = apiOne | apiTwo | apiThree
type sameType = apiOne & apiTwo & apiThree
```


### class
1. class 的好处
- 封装性：它将一个对象相关的所有属性和方法封装在 Class 内部，供外界进行交互
- 继承能力、复用性：通过对已知对象的一层层扩展，我们能够构建出清晰的关系链，大大减少重复属性的编写，获得更简洁与易于维护的代码

```
// example
class User {
  name;
  age;

  constructor(userName, userAge) {
    this.name = userName
    this.age = userAge
  };

  getInfo() {
    return `${this.name} is ${this.age} old`
  }
}

const userOne = new User('john', 10)
const userTwo = new User('dutton', 20)
console.log('1', userOne.name, userOne.age, userOne.getInfo())
console.log('2', userTwo.name, userTwo.age, userTwo.getInfo())
```

2. ts class
```
class Person {
  // private 属性
  private name: string;
  private age: number;

  constructor(personName: string, personAge: number) {
    this.name = personName;
    this.age = personAge;
  }

  public getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }

  // public 方法，可访问 private 属性
  public getName(): string {
    return this.name;
  }

  public getUpperCaseName(): string {
    return this.name.toLocaleUpperCase();
  }
}

const person = new Person('Linbudu', 18);

console.log(person.name); // 属性“name”为私有属性，只能在类“Person”中访问。
console.log(person.getName()); // Linbudu
console.log(person.getUpperCaseName()); // LINBUDU
```

3. 静态成员（可直接调用）、实例成员（需实例化后才可调用）
```
// utils.js 函数的设计（通过功能对其分组；static 定义静态成员方法
export class DateUtils {
  static isSameDate(){ }
  static diffDate(){ }
}

export class NumberUtils { }
export class UserListUtils { }

// 调用
import { DateUtils } from utils.js
DateUtils.isSameDate()
```


### any type（丧失了类型检查的保护
- any 类型 = 万能类型 + 放弃类型检查
```
const name: any = 1 or '1' or true
const myFuncOne = (a: any, b: any): any => {
  return a + b
}
console.log('1', myFuncOne(1, 2)) // 3
console.log('2', myFuncOne('1', '2')) // 12
```

### unknown type（可通过类型断言得到实际业务逻辑中需要的类型 or 兼容历史 interface 定义
- unknown 类型 = 万能类型 + 类型检查
- 可以视为严格版的 any；定义的变量只能赋值给 any、unknown 类型，避免了类型污染（类型污染问题是指定义为 any 类型的变量可以被赋值给任意的其它变量，这样就导致了类型污染，污染程度看实际业务中被赋值变量的范围）

1. unknown 类型断言到具体类型（number、string）；具体类型断言到 unknown 类型（兼容历史 interface 定义）
```TypeScript
// 下述俩函数没有区别
function myFuncOne(params: unknown) {
  // 断言为 number array
  (params as number[]).map((item) => {
    item = item + 1
  })
}

function myFuncOne(params: unknown) {
  // 断言为 array
  (params as unknown[]).map((item) => {
    // 断言为 number
    item = (item as number) + 1
  })
}

// 通过将 unknown 类型的变量进行类型缩小操作，可以将该变量用于其它操作；或者通过类型断言将其类型暂时转换
// unknown 的类型缩小
let a: unknown = 1
// unknown 缩小为 number
if (typeof a === 'number') {
  let r = a + 10 // 正确
}
let s: unknown = 'hello'
// unknown 缩小为 string
if (typeof s === 'string') {
  s.length // 正确
}
```

### never 类型
1. 可以理解为空类型（类似于空集合是所有集合的子集）
```TypeScript
function fn(x: string | number) {
  if (typeof x === 'string') {
    // ...
  } else if (typeof x === 'number') {
    // ...
  } else {
    x // never 类型
  }
}
```

### any、unknown、never
1. 其中 any、unknown 是顶层类型；never 是底层类型
```TypeScript
// never 例子
function throwError(message: string): never {
  throw new Error(message);
}
function infiniteLoop(): never {
  while (true) {}
}
let neverValue: never;
// 任何值都不能赋值给 never 类型的变量
// neverValue = 10;   // Error
// neverValue = "hi"; // Error
// neverValue = true; // Error

// any 例子
let anyValue: any;
let unknownValue: unknown;
anyValue = 10;          // ok
anyValue = "hello";     // ok
anyValue = true;        // ok

// unknown 例子
unknownValue = 10;      // ok
unknownValue = "hello"; // ok
unknownValue = true;    // ok
// 需要类型断言或类型检查才能使用 unknown 类型的变量
if (typeof unknownValue === 'string') {
  console.log(unknownValue.toUpperCase()); // ok
}
```

### bigint 类型
```TypeScript
// bigint 定义需在其后加 n
const x: bigint = 123n
const y: bigint = 0xffffn
```

### 类型缩小
1. '“类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。实际上，联合类型本身可以看成是一种“类型放大”（type widening），处理时就需要“类型缩小”（type narrowing）'
```TypeScript
function getPort(
  scheme: 'http' | 'https'
) {
  switch (scheme) {
    case 'http':
      return 80;
    case 'https':
      return 443;
  }
}j
```

### typeof
1. 获取值的类型（在 ts 中会存在两种 typeof，一种是类型运算，一种是值运算
```TypeScript
let a = 1
// 值运算
let b: typeof a // number

// 类型运算：typeof 来判断 a 的类型
if (typeof a === 'number') {
  b = a
}

```


### 泛型
1. 泛型 and 类型别名
```
type customeType = 'success' | 'failed'

// 泛型 T 可以根据实际情况对类型别名添加自定义的类型
type customeType<T> = 'success' | 'failed' | T
type selfCustomType<'cancel'> = 'success' | 'failed' | 'cancel'（这里泛型可以看作于函数入参

// 上述泛型可看似于下列逻辑实现
function Status(T){
  return ['success', 'failure', 'pending', T]
}
const CompleteStatus = Status('offline');

// 泛型与函数入参结合
// 单个入参
function factory<T>(input: T): T {
  // ...
}

//  多个入参（入参泛型固定为 T1、T2、T3，返回值泛型固定为 T1
function factory<T1, T2, T3>(input1: T1, input2: T2, input3: T3): T1 {}
```


### 内置工具类型（类型编程：参数是类型返回值也是类型
1. Partial 将所有类型（必选 or 可选）标记为可选
```
type User = {
  name: string,
  age: number,
  isMale: boolean,
}

// 这里的 PartialUser 相当于 User 类型中的所有字段均添加了可选符
type PartialUser = Partial<User>

// userOne 中所有字段都是可选的
const userOne: PartialUser = {
  name: 'userOne',
  age: 999,
  isMale: false,
}
const userTwo: PartialUser = {}
```

2. Required 将所有类型（必选 or 可选）标记为必选

3. Readonly 将所有类型定义的字段标记为只读（不允许更改；作用不可逆
```
type User = {
  name: string;
  age: number;
  email: string;
};

type ReadonlyUser = Readonly<User>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

const readonlyUser: ReadonlyUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// 修改 user 对象的属性
user.name = 'Jane Doe';
user.age = 25;
user.email = 'jane.doe@example.com';

// 修改 readonlyUser 对象的属性
// readonlyUser.name = 'Jane Doe';  // 报错
// readonlyUser.age = 25;  // 报错
// readonlyUser.email = 'jane.doe@example.com';  // 报错
```

4. Pick and Omit
```
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  gender: string;
  occupation: string;
  education: string;
  hobby: string;
  bio: string;
};

// Pick（选择传入的；如 include
type UserBasicInfo = Pick<User, 'name' | 'age' | 'email'>;
const userBasicInfo: UserBasicInfo = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// Omit（去掉传入的；如 exclude
type UserDetailedInfo = Omit<User, 'name' | 'age' | 'email'>;
const userDetailedInfo: UserDetailedInfo = {
  phone: '1234567890',
  address: '123 Main St',
  gender: 'male',
  occupation: 'developer',
  education: 'Bachelor',
  hobby: 'reading',
  bio: 'A passionate developer'
};
```

5. Record
```
type UserProps = 'name' | 'job' | 'email';

// 等价于你一个个实现这些属性了（name、job、email 均为 string 类型
type User = Record<UserProps, string>;

const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com'
};
```

6. Exclude and Extract
```
// 差集
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

// OptionalUserProps = UserProps - RequiredUserProps
type OptionalUserProps = Exclude<UserProps, RequiredUserProps>;

const optionalUserProps: OptionalUserProps = 'age'; // 'age' | 'phone' | 'address';

// 交集
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

type RequiredUserPropsOnly = Extract<UserProps, RequiredUserProps>;

const requiredUserPropsOnly: RequiredUserPropsOnly = 'name'; // 'name' | 'email';
```

7. Parameters（入参） and ReturnType（返回值）
```TypeScript
function multiply(a: number, b: number): number {
  return a * b
}
type MultiplyParameters = Parameters<typeof multiply> // [number, number]
type MultiplyReturnType = ReturnType<typeof multiply> // number
const anotherMultiply: (...args: MultiplyParameters) => MultiplyReturnType = (
  x,
  y
) => {
  return x * y
}
```

8. typeof
- 可用来获取函数的类型推导（入参 -> 返回值）
```TypeScript
const addHandler = (a: number, b: number) => a + b
typeof addHandler // function
```

9. Awaited
- 获取异步函数（如 Promise()）的类型
```
const promise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 1000);
});
type PromiseInput = Promise<string>;
type AwaitedPromiseInput = Awaited<PromiseInput>; // string

// 定义一个函数，该函数返回一个 Promise 对象
async function getPromise() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("Hello, World!");
    }, 1000);
  });
}
type Result = Awaited<ReturnType<typeof getPromise>>; // string 类型
```

### 模版字符串类型
1. 精确的类型结构
```
type Version = `${number}.${number}.${number}`;
const v1: Version = '1.1.0';
const v2: Version = '1.0'; // 报错：类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
const v3: Version = 'a.0.0'; // 报错：类型 "a.0" 不能赋值给类型 `${number}.${number}.${number}`
```

2. 模版字符串搭配类型别名
```
// 这里需要用到 extends（后续高级用法
type SayHello<T extends string | number> = `Hello ${T}`;
type Greet1 = SayHello<"linbudu">; // "Hello linbudu"
type Greet2 = SayHello<599>; // "Hello 599"
```

3. 模版字符串根据模版自动生成 type
```
type Brand = 'iphone' | 'xiaomi' | 'honor';
type SKU = `${Brand}`; // "iphone" | "xiaomi" | "honor"
type SKU-LIST = `${Brand}-list`; // "iphone-list" | "xiaomi-list" | "honor-list"

type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';
type SKU = `${Brand}-${Memory}-${ItemType}`;
```

### 阮一峰 ts 入门：数组
1. 数组类型的声明
```TypeScript
let arrOne: (number | string)[] = [1, '1']
let arrTwo: Array<number | string> = [1, '1']
```

2. 声明只读数组
```TypeScript
const arrOne: ReadonlyArray<number> = [1, 2]
const arrTwo: Readonly<number[]> = [1, 2]
// const 断言
const arrThree = [0, 1] as const
```

3. 多维数组
```TypeScript
var multi: number[][] = [
  [1, 2, 3],
  [23, 24, 25],
]

// 多个类型（更多维度类似添加即可
// 声明一个可以包含 string 或 number 类型的二维数组
let multiArray: Array<string | number | Array<string | number>> = [
  'hello',
  42,
  ['world', 100],
]

// 访问元素
console.log(multiArray[0]) // 输出: hello
console.log(multiArray[1]) // 输出: 42
console.log(multiArray[2]) // 输出: [ 'world', 100 ]

// 访问子数组中的元素
if (Array.isArray(multiArray[2])) {
  console.log(multiArray[2][0]) // 输出: world
  console.log(multiArray[2][1]) // 输出: 100
}

// 向数组添加新的元素
multiArray.push(['new', 200])

console.log(multiArray) // 输出: [ 'hello', 42, [ 'world', 100 ], [ 'new', 200 ] ]
```

4. Readonly number[] 和 numebr[]
- 'TypeScript 将 readonly number[] 与 number[] 视为两种不一样的类型，后者是前者的子类型；这是因为只读数组没有 pop()、push() 之类会改变原数组的方法，所以 number[] 的方法数量要多于 readonly number[]，这意味着 number[] 其实是 readonly number[] 的子类型；我们知道，子类型继承了父类型的所有特征，并加上了自己的特征，所以子类型 number[] 可以用于所有使用父类型的场合，反过来就不行'
- 子类型继承父类型并扩展父类型没有的功能

### 阮一峰 ts 入门：元组
1. 如何区分数组和元组？
- 看类型（number、string 等）写在中括号内还是外
```TypeScript
let arr1: number[] = [1]
let arr2: [number] = [1]

// 元组可选（可选符号只能在尾部的元素
let a: [number, number?] = [1]

type myTuple1 = [number?, number, number?, string?] // 非法，? 在头部
type myTuple2 = [number, number?, number?, string?] // 合法
```

### 阮一峰 ts 入门：symbol
1. unique symbol 是 symbol 的子集；unique symbol 强制指定类型的值，symbol 不强制
```TypeScript
const sym1: symbol = Symbol()
const sym2: symbol = Symbol()
// 值的类型不强制
interface MyInterface {
  [sym1]: string
  [sym2]: number
}
// 下述两者定义都可以
let myObj: MyInterface = {
  [sym1]: 'value1',
  [sym2]: 42,
  
  [sym1]: 42,
  [sym2]: 'value1',
}
console.log(myObj[sym1]) // 输出 "value1"
console.log(myObj[sym2]) // 输出 42

const sym1: unique symbol = Symbol()
const sym2: unique symbol = Symbol()
// 强制指定值的类型
interface MyInterface {
  [sym1]: string
  [sym2]: number
}
let myObj: MyInterface = {
  [sym1]: 'value1',
  [sym2]: 42,

  // 下述这种定义会报错
  // [sym1]: 42,
  // [sym2]: 'value1',
}
console.log(myObj[sym1]) // 输出 "value1"
console.log(myObj[sym2]) // 输出 42
```

### 阮一峰 ts 入门：函数
1. 变量要套用另一个函数类型（typeof
```TypeScript
function add(x: number, y: number) {
  return x + y
}
const myAdd: typeof add = function (x, y) {
  return x + y
}
myAdd(1, 2)
myAdd('1', 2) // 参数类型错误
```

2. 箭头函数 map
```TypeScript
type Person = { name: string }

const people = ['alice', 'bob', 'jan'].map((name): Person => ({ name }))
const people = ['alice', 'bob', 'jan'].map((name: string): Person => ({ name }))
console.log(people) // [ { name: 'alice' }, { name: 'bob' }, { name: 'jan' } ]
```

3. 可选参数
```TypeScript
// 可选参数需在尾部
let myFunc: (a?: number, b: number) => number // 报错

// 可选参数在头部的处理
let myFunc: (a: number | undefined, b?: number) => number

// 用到可选参数时需判断 undefined
let myFunc: (a: number, b?: number) => number
myFunc = function (x, y) {
  if (y === undefined) {
    return x
  }
  return x + y
}
```

4. 参数解构
```TypeScript
// 对象
function sumOne({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c)
}

// 数组
function sumTwo([a, b]: [number, number]) {
  console.log(a + b)
}

// 利用类型别名
type ABC = { a: number; b: number; c: number }
function sumThree({ a, b, c }: ABC) {
  console.log(a + b + c)
}
```

5. void 返回值
- 允许没有返回值 or 返回 null（未开始严格检查 null 的情况下） or 返回 undefiend
```TypeScript
function f(): void {
  console.log('hello')
}
function f(): void {
  return undefined // 正确
}
function f(): void {
  return null // 正确
}
```

6. never 返回值
- '注意，never 类型不同于 void 类型。前者表示函数没有执行结束，不可能有返回值；后者表示函数正常执行结束，但是不返回值，或者说返回 undefined'

7. type 存在局部作用域

### 阮一峰 ts 入门：对象
1. 可选属性
```TypeScript
// 可选属性等同于 undefined
const objOne: {
  x: number;
  y?: number
} = { x: 1 }

const objTwo: {
  x: number;
  y: number | undefined
} = { x: 1 }
```

2. 创建空对象
```TypeScript
// 空对象可以被赋值，不能对属性进行操作
let objOne: {} = {}
let objectTwo: Object = {}
objOne = { name: 'name' } // yes
console.log(objOne.name) // error

// 没有任何属性的空对象
interface WithoutProperties {
  [key: string]: never
}
// 报错：interface 定义的对象值为 never 类型，即不存在
const a: WithoutProperties = { prop: 1 }
```

### 阮一峰 ts 入门：interface
1. interface 中函数做键与函数重载
```TypeScript
interface A {
  f(): number
  f(x: boolean): boolean
  f(x: string, y: string): string
}

function MyFunc(): number
function MyFunc(x: boolean): boolean
function MyFunc(x: string, y: string): string
// 根据条件进行函数重载实现
function MyFunc(x?: boolean | string, y?: string): number | boolean | string {
  if (x === undefined && y === undefined) return 1
  if (typeof x === 'boolean' && y === undefined) return true
  if (typeof x === 'string' && typeof y === 'string') return 'hello'
  throw new Error('wrong parameters')
}

const a: A = {
  f: MyFunc,
}
```

2. 如何给 interface 添加新的类型属性？
```TypeScript
// 定义同名 interface 即可
interface A {
  name: string
}
interface A {
  age: string
}
const obj: A = { name: 'name', age: 'age' }
```

### 阮一峰 ts 入门：类（class
1. 类满足 interface or type（implements 关键字
```TypeScript
interface Country {
  name: string
  capital: string
}
// 或者
type Country = {
  name: string
  capital: string
}

// 类 MyCountry 满足 interface or type Country；同时可扩展自己的类型属性
class MyCountry implements Country {
  name = ''
  capital = ''
  info: string = ''
}
```

2. 类的可访问性修饰符
- public：public 修饰符表示这是公开成员，外部可以自由访问
- private：private 修饰符表示私有成员，只能用在当前类的内部，类的实例和子类都不能使用该成员；子类不能定义父类私有成员的同名成员；可通过 []、in 操作符访问
- #（es2022 后版本定义私有成员）：真正的私有成员
- protected：protected 修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用；可以定义同名成员
```TypeScript
// 子类通过 []、in 访问父类私有成员
class A {
  private x = 1
}
const a = new A()
a['x'] // 1
if ('x' in a) {
  // 正确
  // ...
}

// # 定义私有成员
class A {
  #x = 1
}
const a = new A()
a['x'] // 报错
```

3. 静态成员（static 关键字
```TypeScript
// 只能通过原始类访问到静态成员，不能通过实例对象调用
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
  }
}

MyClass.x // 0
MyClass.printX() // 0

// 上述的例外情况：public和protected的静态成员可以被继承
class A {
  public static x = 1
  protected static y = 1
}

// B 继承 A，可访问其 public、protected 的静态成员
class B extends A {
  static getY() {
    return B.y
  }
}

B.x // 1
B.getY() // 1
```

4. 抽象类
```TypeScript
abstract class A {
  id = 1
}

const a = new A() // 报错
```

### 阮一峰 ts 入门：泛型
1. 类型别名的泛型
```TypeScript
type Container<T> = { value: T }
const a: Container<number> = { value: 0 }
const b: Container<string> = { value: 'b' }

// 定义 tree 结构
type Tree<T> = {
  value: T
  left: Tree<T> | null
  right: Tree<T> | null
}
```

2. 对泛型的约束
```TypeScript
// 必须有 length 属性
function comp<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a
  }
  return b
}
comp([1, 2], [1, 2, 3]) // 正确
comp('ab', 'abc') // 正确
comp(1, 2) // 报错

// 默认值
type Fn<A extends string, B extends string = 'world'> = [A, B]
type Result = Fn<'hello'> // ["hello", "world"]

// 引用参数的约束条件（不能引用自身
<T, U extends T>
<T extends U, U>
```

### 阮一峰 ts 入门：枚举类型（enum
1. enum 成员值都是只读的，不能重新赋值
```TypeScript
enum Foo {
  A,
  B,
  C,
}
const Bar = {
  A: 0,
  B: 1,
  C: 2,
}
if (x === Foo.A) {}
// 等同于
if (x === Bar.A) {}

// 只读（加上 const 更易于理解
const enum Color {
  Red,
  Green,
  Blue
}
```

2. 同名 enum 结构会自动合并

3. 字符串 enum
```TypeScript
enum MyEnum {
  One = 'One',
  Two = 'Two',
}

let s = MyEnum.One
s = 'One' // 报错

function f(arg: MyEnum) {
  return 'arg is ' + arg
}
f('One') // 报错
f(MyEnum.One) // 报错
```

### 阮一峰 ts 入门：类型断言
1. 是什么：'TypeScript 提供了“类型断言”这样一种手段，允许开发者在代码中“断言”某个值的类型，告诉编译器此处的值是什么类型。TypeScript 一旦发现存在类型断言，就不再对该值进行类型推断，而是直接采用断言给出的类型'

2. 坏处：错误的类型断言会让错误的代码通过类型编译

3. 断言条件：类型断言要求实际的类型与断言的类型兼容，实际类型可以断言为一个更加宽泛的类型（父类型），也可以断言为一个更加精确的类型（子类型），但不能断言为一个完全无关的类型
```TypeScript
// 当前类型断言到更宽泛 or 更精确的类型
const n = 1;
const m: string = n as string // 报错

// 绕过断言条件：通过 any、unknown 类型作为中间类型断言
expr as any or unknown as T
const n = 1
const m: string = n as unknown as string // 正确
```

4. as const 断言
- 只能用于字面量；不能用于变量、表达式
```TypeScript
// 应用于变量
let s = 'JavaScript';
setLang(s as const); // 报错

// 应用于表达式
let s = ('Java' + 'Script') as const; // 报错

// 应用于对象
const v1 = {
  x: 1,
  y: 2,
}; // 类型是 { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
}; // 类型是 { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const; // 类型是 { readonly x: 1; readonly y: 2; }
```

5. ! 非空断言
```TypeScript
// ! 断言 root 不为 null
const root = document.getElementById('root')!;
root.addEventListener('click', e => {
  /* ... */
});

// 保险做法（手动判断更保险
const root = document.getElementById('root');

if (root === null) {
  throw new Error('Unable to find DOM element #root');
}

root.addEventListener('click', e => {
  /* ... */
});
```

6. 断言函数
```TypeScript
// 写法一
const assertIsNumber = (
  value:unknown
):asserts value is number => {
  if (typeof value !== 'number')
    throw Error('Not a number');
};

// 写法二
type AssertIsNumber =
  (value:unknown) => asserts value is number;

const assertIsNumber: AssertIsNumber = (value) => {
  if (typeof value !== 'number')
    throw Error('Not a number');
};
```

7. 类型保护函数（返回 boolean 值：true、false
```TypeScript
function isString(
  value:unknown
): value is string {
  return typeof value === 'string';
}
```

8. 断言函数、类型保护函数：两者具体对参数类型的判断都需在函数内部实现
```TypeScript
// 类型断言导致运行时错误
let unknownValue: unknown = 42;
let stringValue: string = unknownValue as string; // 类型断言，编译器不会报错
// 运行时尝试调用字符串方法，会导致错误
console.log(stringValue.toUpperCase()); // 运行时错误：TypeError: stringValue.toUpperCase is not a function

// 通过类型保护函数保护
let unknownValue: unknown = 42;
if (typeof unknownValue === 'string') {
  let stringValue: string = unknownValue; // 类型检查后赋值，确保类型安全
  console.log(stringValue.toUpperCase()); // 运行时安全
} else {
  console.log("The value is not a string");
}
```

### 阮一峰 ts 入门：模块
1. import type 语句
```TypeScript
// a.ts
export interface A {
  foo: string;
}
export let a = 123;

// b.ts
// 正确
import type { A } from './a';
let b: A = 'hello';
// 报错
import type { a } from './a';
let b = a;
```

2. export type 语句
```TypeScript
type A = 'a';
type B = 'b';
// 方法一
export {type A, type B};
// 方法二
export type {A, B};
```

### 阮一峰 ts 入门：类型运算符
1. keyof 运算符
```TypeScript
// 联合类型
type A = { a: string; z: boolean };
type B = { b: string; z: boolean };
// 返回 'z'
type KeyT = keyof (A | B);

// 交叉类型
type A = { a: string; x: boolean };
type B = { b: string; y: number };
// 返回 'a' | 'x' | 'b' | 'y'
type KeyT = keyof (A & B);
// 相当于
keyof (A & B) ≡ keyof A | keyof B

// 返回值组成的类型
type MyObj = {
  foo: number,
  bar: string,
};
type Keys = keyof MyObj;
type Values = MyObj[Keys]; // number|string

// keyof 在业务中的实际运用
// 限制函数的参数类型，自动推断函数返回类型（参数 T、K 的类型得到了限制，减少错误产生
function getValue<T extends Object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const objOne = { name: '张三', age: 18 }
// 只能传入 objOne 对象上有点属性，这里是 name、age
const valueOne = getValue(objOne, 'name')
const valueTwo = getValue(objOne, 'age')
```

2. in 运算符
- TypeScript 语言的类型运算中，in 运算符有不同的用法，用来取出（遍历）联合类型的每一个成员类型
```TypeScript
type U = 'a'|'b'|'c';
type Foo = {
  [Prop in U]: number;
};
// 等同于
type Foo = {
  a: number,
  b: number,
  c: number
};
```

3. [] 运算符
- 方括号运算符（[]）用于取出对象的键值类型，比如 T[K] 会返回对象 T 的属性 K 的类型
```TypeScript
type Person = {
  age: number;
  name: string;
  alive: boolean;
};
// number|string
type T = Person['age'|'name'];
// number|string|boolean
type A = Person[keyof Person];

// 方括号内不能有值的运算
// 示例一
const key = 'age';
type Age = Person[key]; // 报错
// 示例二
type Age = Person['a' + 'g' + 'e']; // 报错
```

4. extends ? 条件运算符
```TypeScript
// tpl
T extends U ? X : Y

// [] 将传入泛型作为整体
// 示例一（返回联合类型
type ToArray<Type> =
  Type extends any ? Type[] : never;
// string[]|number[]
type T = ToArray<string|number>;
// 示例二
type ToArray<Type> =
  [Type] extends [any] ? Type[] : never;
// (string | number)[]
type T = ToArray<string|number>;

// 嵌套使用
type LiteralTypeName<T> =
  T extends undefined ? "undefined" :
  T extends null ? "null" :
  T extends boolean ? "boolean" :
  T extends number ? "number" :
  T extends bigint ? "bigint" :
  T extends string ? "string" :
  never;
// "bigint"
type Result1 = LiteralTypeName<123n>;
// "string" | "number" | "boolean"
type Result2 = LiteralTypeName<true | 1 | 'a'>;
```

5. 交叉类型和联合类型
- 注意以下情况
```TypeScript
type TypeOne = number | string // number | string
type TypeTwo = number & string // 不存在这种类型

// 用 keyof 的情况下
type A = { a: string; z: boolean };
type B = { b: string; z: boolean };
// 返回 'z'
type KeyT = keyof (A | B);

// 交叉类型
type A = { a: string; x: boolean };
type B = { b: string; y: number };
// 返回 'a' | 'x' | 'b' | 'y'
type KeyT = keyof (A & B);
// 相当于
keyof (A & B) ≡ keyof A | keyof B
```

6. infer 关键字
```TypeScript
type MyType<T> =
  T extends {
    a: infer M,
    b: infer N
  } ? [M, N] : never;
// 用法示例
type T = MyType<{ a: string; b: number }>;
// [string, number]

type Str = 'foo-bar';
type Bar = Str extends `foo-${infer rest}` ? rest : never // 'bar'

// 推断函数参数类型
type ParametersType<T> = T extends (...args: infer P) => any ? P : never;
type ExampleFunction2 = (a: number, b: string) => void;
type ExampleParametersType = ParametersType<ExampleFunction2>; // [number, string]

// 推断元组的第一个元素类型
type FirstElement<T> = T extends [infer U, ...any[]] ? U : never;
type ExampleTuple = [number, string, boolean];
type ExampleFirstElement = FirstElement<ExampleTuple>; // number

// 推断 Promise 的返回类型
type PromiseType<T> = T extends Promise<infer U> ? U : never;
type ExamplePromise = Promise<number>;
type ExamplePromiseType = PromiseType<ExamplePromise>; // number

// 推断数组元素的类型
type ElementType<T> = T extends (infer U)[] ? U : never;
type ExampleArray = string[];
type ExampleElementType = ElementType<ExampleArray>; // string

// 推断函数的返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ExampleFunction = (a: number, b: string) => boolean;
type ExampleReturnType = ReturnType<ExampleFunction>; // boolean
```

7. is 运算符
- 主要用来创建类型保护函数
```TypeScript
type A = { a: string };
type B = { b: string };

// 返回 true - x 一定是 A 类型；false 反之
function isTypeA(x: A|B): x is A {
  if ('a' in x) return true;
  return false;
}

// 检查联合类型
type Shape = Circle | Square;
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; sideLength: number };
function isCircle(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}
const myShape: Shape = { kind: "circle", radius: 10 };
if (isCircle(myShape)) {
  console.log(myShape.radius); // TypeScript 知道 myShape 是 Circle 类型
}

// 结合 is 运算符和联合类型
type Animal = { name: string };
type Cat = Animal & { meow: () => void };
type Dog = Animal & { bark: () => void };
function isCat(animal: Animal): animal is Cat {
  return (animal as Cat).meow !== undefined;
}
function isDog(animal: Animal): animal is Dog {
  return (animal as Dog).bark !== undefined;
}
const pet: Animal = { name: "Whiskers", meow: () => console.("Meow!") };
if (isCat(pet)) {
  pet.meow(); // TypeScript 知道 pet 是 Cat 类型
} else if (isDog(pet)) {
  pet.bark(); // TypeScript 知道 pet 是 Dog 类型
}

// 使用类型保护函数过滤数组
function isNumber(value: any): value is number {
  return typeof value === 'number';
}
const values: any[] = [1, "hello", 2, "world", 3];
const numbers = values.filter(isNumber);
console.log(numbers); // [1, 2, 3]

// 定义类型保护函数
function isString(value: any): value is string {
  return typeof value === 'string';
}
const value: any = "hello";
if (isString(value)) {
  console.log(value.toUpperCase()); // TypeScript 知道 value 是 string 类型
}
```

8. 模版字符串
- 可引用的类型：string、number、boolean、null、undefined、bigint、Enum
```TypeScript
type Num = 123;
type Obj = { n : 123 };

type T1 = `${Num} received`; // 正确
type T2 = `${Obj} received`; // 报错（不可引用对象类型

// 单个联合类型
type T = 'A'|'B';
// "A_id"|"B_id"
type U = `${T}_id`;

// 多个联合类型
type T = 'A'|'B';
type U = '1'|'2';
// 'A1'|'A2'|'B1'|'B2'
type V = `${T}${U}`;
```

### 阮一峰 ts 入门：类型映射
1. 是什么：映射（mapping）指的是，将一种类型按照映射规则，转换成另一种类型，通常用于对象类型
```TypeScript
// number to string
type A = {
  foo: number;
  bar: number;
};
type B = {
  [prop in keyof A]: string;
};

// mapping 自身
type A = {
  foo: number;
  bar: number;
};
type B = {
  [prop in keyof A]: A[prop];
};

// mapping 全部映射为可选
type A = {
  a: string;
  b: number;
};
type B = {
  [Prop in keyof A]?: A[Prop];
};

// Readonly<T> 内置工具类型的实现
// 将 T 的所有属性改为只读属性
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

2. 映射修饰符
- +?、-?、+readonly、-readonly
```TypeScript
// 增加
type MyObj<T> = {
  +readonly [P in keyof T]+?: T[P];
};
// 移除
type MyObj<T> = {
  -readonly [P in keyof T]-?: T[P];
}

// Required<T> 内置工具类型的实现
// 全部移除可选，变为必选属性
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

3. 键名重映射
```TypeScript
// 01
type A = {
  foo: number;
  bar: number;
};
type B = {
  [p in keyof A as `${p}ID`]: number;
};
// 等同于
type B = {
  fooID: number;
  barID: number;
};

// 02
interface Person {
  name: string;
  age: number;
  location: string;
}
// Capitalize<T>：内置工具类型
type Getters<T> = {
  [P in keyof T
    as `get${Capitalize<string & P>}`]: () => T[P];
};
type LazyPerson = Getters<Person>;
// 等同于
type LazyPerson = {
  getName: () => string;
  getAge: () => number;
  getLocation: () => string;
}
```

4. 属性过滤
```TypeScript
type User = {
  name: string,
  age: number
}
type Filter<T> = {
  [K in keyof T
    as T[K] extends string ? K : never]: string
}
type FilteredUser = Filter<User> // { name: string }
```

5. 联合类型的映射
```TypeScript
type S = {
  kind: 'square',
  x: number,
  y: number,
};
type C = {
  kind: 'circle',
  radius: number,
};
type MyEvents<Events extends { kind: string }> = {
  [E in Events as E['kind']]: (event: E) => void;
}
// 传入联合类型
type Config = MyEvents<S|C>;
// 等同于
type Config = {
  square: (event:S) => void;
  circle: (event:C) => void;
}
```

### 阮一峰 ts 入门：类型工具
1. `Awaited<Type>`
```TypeScript
// 多层
// number
type B = Awaited<Promise<Promise<number>>>;

// 非 Promsie 类型
// number | boolean
type C = Awaited<boolean | Promise<number>>;
```

2. `Exclude<Type, Union>`
```TypeScript
// 例子
type T1 = Exclude<'a'|'b'|'c', 'a'>; // 'b'|'c'
type T2 = Exclude<'a'|'b'|'c', 'a'|'b'>; // 'c'
type T3 = Exclude<string|(() => void), Function>; // string
type T4 = Exclude<string | string[], any[]>; // string
type T5 = Exclude<(() => void) | null, Function>; // null
type T61 = Exclude<200 | 400, 200 | 201>; // 400
type T62 = Exclude<200 | 400, 200 | 201 | 400>; // never
type T7 = Exclude<number, boolean>; // number

// 实现（返回的 never 可以省去
type Exclude<T, U> = T extends U ? never : T
```

2. `Extract<Type, Union>`
```TypeScript
// 例子
type T1 = Extract<'a'|'b'|'c', 'a'>; // 'a'
type T2 = Extract<'a'|'b'|'c', 'a'|'b'>; // 'a'|'b'
type T3 = Extract<'a'|'b'|'c', 'a'|'d'>; // 'a'
type T4 = Extract<string | string[], any[]>; // string[]
type T5 = Extract<(() => void) | null, Function>; // () => void
type T6 = Extract<200 | 400, 200 | 201>; // 200

// 特殊情况
type T01 = Extract<string|number, boolean>; // never
type T02 = Extract<200 | 400, 111>; // never

// 实现
type Extract<T, U> = T extends U ? T : never
```

3. `NonNullable<Type>`
- 移除 null 和 undefined
```TypeScript
// 例子
// string|number
type T1 = NonNullable<string|number|undefined>;
// string[]
type T2 = NonNullable<string[]|null|undefined>;
type T3 = NonNullable<boolean>; // boolean
type T4 = NonNullable<number|null>; // number
type T5 = NonNullable<string|undefined>; // string
type T6 = NonNullable<null|undefined>; // never

// 实现
// null、undefined 不属于 Object
type NonNullable<T> = T & {} = T & Object
```

4. Omit
- link：https://wangdoc.com/typescript/utility#omittype-keys
```TypeScript
// 实现
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

5. Partical
- link：https://wangdoc.com/typescript/utility#partialtype
```TypeScript
// 实现
type Partical<T> = {
  [P in keyof T]?: T[P]
  or
  [P in keyof T]+?: T[P]
}
```

6. Pick
- link：https://wangdoc.com/typescript/utility#picktype-keys
```TypeScript
// 实现
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

7. Readonly
- link：https://wangdoc.com/typescript/utility#readonlytype
```TypeScript
// 实现只读
type Readonly<T> = {
  +readonly [P in keyof T]: T[P];
};

// 实现不只读
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

8. Record
- link：https://wangdoc.com/typescript/utility#recordkeys-type
```TypeScript
// 例子
// { a: number, b: number }
type T = Record<'a'|'b', number>;
// { a: number|string }
type T = Record<'a', number|string>;

// 实现
type Record<K extends string|number|symbol, T> = { [P in K]: T; }
```


9. Required
- link：https://wangdoc.com/typescript/utility#requiredtype
```TypeScript
// 实现
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

10. 字符串内置工具类型
- Uppercase、Lowercase、Capitalize（首字母大写）、Uncapitalize（首字母小写）

11. `Equal<T, U>`
- 用来判断两个类型是否相等
```TypeScript
// T 可以赋值给 U 且 U 可以赋值给 T 时两者才相等
type Equal<T, U> = T extends U ? (U extends T ? true : false) : false
```

12. `Expect<T>`
```TypeScript
// 确保类型 T 是 true 类型
type Expect<T extends true> = T
```

### 阮一峰 ts 入门：注释指令
1. @ts-nocheck、@ts-check：作用于文件顶部

2. @ts-ignore：作用于下一行

3. JSDoc
```JavaScript
// 例子 01（接收参数 somebody 的类型为 string
/**
 * @param {string} somebody
 */
function sayHello(somebody) {
  console.log('Hello ' + somebody);
}
```

### 阮一峰 ts 入门：tsconfig.json
- link：https://wangdoc.com/typescript/tsconfig.json



### others
1. 函数重载
```
function sum(x, y) {
  if (typeof x === 'number' && typeof y === 'number') {
    return x + y;
  } else if (Array.isArray(x) && typeof y === 'number') {
    return x.map((num) => num + y);
  } else if (typeof x === 'number' && Array.isArray(y)) {
    return y.map((num) => num + x);
  } else if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      throw new Error('Arrays must have the same length');
    }
    return x.map((num, index) => num + y[index]);
  } else {
    throw new Error('Invalid arguments');
  }
}
console.log(sum(2, 3)); // 5
console.log(sum([1, 2, 3], 4)); // [5, 6, 7]
console.log(sum(5, [1, 2, 3])); // [6, 7, 8]
console.log(sum([1, 2, 3], [4, 5, 6])); // [5, 7, 9]
console.log(sum('a', 'b')); // Error: Invalid arguments
console.log(sum([1, 2, 3], [4, 5])); // Error: Arrays must have the same length

2. 类型重载（入参和返回值都可支持多种类型，具体返回通过具体逻辑实现，实际和上述 if - else 判断没区别，只是 ide 编写代码时会有实现类型的提示？
function sum(x: number | number[], y: number | number[]): number | number[] {
  if (typeof x === 'number' && typeof y === 'number') {
    return x + y;
  } else if (Array.isArray(x) && typeof y === 'number') {
    return x.map((num) => num + y);
  } else if (typeof x === 'number' && Array.isArray(y)) {
    return y.map((num) => num + x);
  } else if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      throw new Error('Arrays must have the same length');
    }
    return x.map((num, index) => num + y[index]);
  } else {
    throw new Error('Invalid arguments');
  }
}
console.log(sum(2, 3)); // 5
console.log(sum([1, 2, 3], 4)); // [5, 6, 7]
console.log(sum(5, [1, 2, 3])); // [6, 7, 8]
console.log(sum([1, 2, 3], [4, 5, 6])); // [5, 7, 9]
console.log(sum('a', 'b')); // Error: Invalid arguments
console.log(sum([1, 2, 3], [4, 5])); // Error: Arrays must have the same length
```

3. react 中定义组件时为其传入的属性定义类型
```TypeScript
import * as React from 'react';

interface HomeProps {
  owner: string;
}

// owner 属性传入只能是 string 类型
const Home: React.FC<HomeProps> = ({ owner }) => {
  return <>Home of {owner}</>;
};

const App1: React.FC = () => {
  // 合法
  return <Home owner='me' />;
};

const App2: React.FC = () => {
  // 非法：不能将类型 number 分配给类型 string。
  return <Home owner={599} />;
};
```

4. react 中为状态管理钩子定义类型
```
function App() {
  // number type
  const [count, setCount] = useState<number>(0)
  return <></>
}
export default App

function App() {
  // never[]
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    // 非法：对于每个元素，都会提示不能将类型 number 分配给类型 string
    setList([1, 2, 3]);
  });

  return <></>;
}
export default App;
```

5. keyof 操作符、extends keyof
- keyof: 取interface的键后保存为联合类型
```
interface userInfo {
  name: string
  age: number
}
type keyofValue = keyof userInfo
// keyofValue = "name" | "age"
```

- extends keyof
```
interface User {
  name: string,
  age: number
}
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const user: User = {
  name: 'name',
  age: 99
}
console.log('1', getProperty(user, 'name'))
console.log('2', getProperty(user, 'age'))
```

6. in 操作符
- in: 取联合类型的值，主要用于数组和对象的构建
```
type name = 'firstname' | 'lastname'
type TName = {
  [key in name]: string
}
// TName = { firstname: string, lastname: string }
```

7. as const and Object.freeze
- Object.freeze：返回值为对象自身（即返回值也被冻结）
- Object.isFrozen()；返回 true、false
```TypeScript
// as const 可将属性设置为 readonly
const objOne = {
  name: 'john',
  age: 18,
  sex: 'male'
} as const
objOne.name = 'liu' // name is readonly

// Object.freeze 可将对象冻结（浅层冻结）
const objTwo = Object.freeze({
  name: 'john',
  age: 18,
  sex: 'male',
  info: {
    paramsOne: 1,
    paramsTwo: 2
  }
})
objTwo.name = 'liu' // error
objTwo.info.paramsOne = 11

// Array 是特殊的 Object
const arrOne = Object.freeze([1, 2, 3, { key: 4 }])
arrOne[0] = 11 // error

// 循环 freeze 对象
// 递归实现（没有退出条件，容易造成栈溢出、性能问题
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};

// 迭代实现
var constantize = (obj) => {
  let stack = [obj];

  while (stack.length) {
    let currentObj = stack.pop();
    Object.freeze(currentObj);

    Object.keys(currentObj).forEach(key => {
      if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
        stack.push(currentObj[key]);
      }
    });
  }
};
// 示例
let myObj = {
  a: 1,
  b: {
    c: {
      d: 2,
      e: {
        f: 3
      }
    }
  }
};
constantize(myObj);
myObj.a = 10; // 无效，myObj.a 仍然是 1
myObj.b.c.d = 20; // 无效，myObj.b.c.d 仍然是 2
console.log(myObj); // { a: 1, b: { c: { d: 2, e: { f: 3 } } } }
```

8. Object.seal()
- link（可以简单理解为密封一个对象）：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
- Object.isSealed()

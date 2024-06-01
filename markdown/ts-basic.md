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
```JavaScript
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
```
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

3. 字面量类型 or 字面量联合、交叉类型（通过类型别名更严格的定义类型
```
type Status = 'success' | 'failed' // 只能是 'success' or 'failed'（比 string 类型更具体
type statusCode = 200 | 201 | 202
const fetchStatus: Status = 'success' or 'failed'
```

4. 联合 or 交叉类型与 interface 的结合
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

1. unknown 类型断言到具体类型（number、string）；具体类型断言到 unknown 类型（兼容历史 interface 定义）
```
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
```JavaScript
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
```JavaScript
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
```JavaScript
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
```JavaScript
// as const 可将属性设置为 readonly
const objOne = {
  name: 'john',
  age: 18,
  sex: 'male'
} as const
objOne.name = 'liu'

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
```
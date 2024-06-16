### 4 - easy - 实现 Pick
1. 注意 keyof 及 in 运算符的使用
- keyof：取 interface 的键保存为联合类型
- in：取联合类型的值，主要用于数组、对象的构建
```TypeScript
type SelfPick<T, U extends keyof T> = {
  [prop in U]: T[prop]
}
```

### 7 - easy - 对象属性只读
```TypeScript
interface Todo {
  title: string
  description: string
}

// 'title' | 'description'
type Type1 = keyof Todo
const num1: Type1 = 'title'

type MyReadonly<T> = {
  readonly [prop in keyof T]: T[prop]
}
// num2 的属性都只读
const num2: MyReadonly<Todo> = {
  title: 'title',
  description: 'description',
}
```

### 11 - easy - 元组转对象
```TypeScript
const tuple = ['1', 'here', 3] as const

type Type1 = typeof tuple
const num1: Type1 = ['1', 'here', 3]

// 元组的索引都是 number 类型
type TupleToObject<T extends readonly any[]> = {
  [prop in T[number]]: prop
}

// 这里需传入 typeof tuple
type Type2 = TupleToObject<typeof tuple>
const num2: Type2 = { 1: '1', here: 'here', 3: 3 }

// 注意 keyof any 的返回值：远影在于对象只能用 string、number、symbol 三种类型做键
// string | number | symbol
type Type3 = keyof any

// 元组可以看作是键为数字的对象
type Tuple1 = { 0: string, 1: number, 2: boolean }
const resultTuple1: Tuple1 = ['1', 2, true]
```

### 14 - easy - 获取数数组的第一个元素
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.zh-CN.md
2. 注意需判断传入泛型是否符合要求，这里是 T extends any[]，以此来限制传入的需是兼容 any 类型的数组
```TypeScript
// 判断空数组
type First1<T extends any[]> = T extends [] ? never : T[0]

// 判断数组长度即判断空数组
type First2<T extends any[]> = T['length'] extends 0 ? never : T[0]

// 判断传入的泛型可不可以分解为 [infer A, ...infer rest] 的形式，其中 A 表示第一个元素，rest 表示剩余元素，注意两者前 infer 都需要添加
// 此种方式兼容单个传入的情况，如 [1]、[1, '2'] 等
type First3<T extends any[]> = T extends [infer A, ...infer rest] ? A : never
```

### 18 - easy - 获取元组长度
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00018-easy-tuple-length/README.zh-CN.md
2. 注意泛型参数限制（该题为元组）：T extends readonly any[]
```TypeScript
// 1、2 的区别在于传入的泛型不对时会有问题
type Length1<T extends readonly any[]> = T['length']
type Length2<T extends readonly any[]> = T extends { length: infer A }
  ? A
  : never

// 示例 1：传递数组
type ArrayExample = [number, string, boolean];
type Length1ArrayExample = Length1<ArrayExample>; // 3
type Length2ArrayExample = Length2<ArrayExample>; // 3

// 示例 2：传递非数组对象
type ObjectExample = { length: 10 };
type Length1ObjectExample = Length1<ObjectExample>; // Error: Type 'ObjectExample' does not satisfy the constraint 'readonly any[]'.
type Length2ObjectExample = Length2<ObjectExample>; // 10

// 示例：联合类型
type UnionExample = [number, string] | [boolean];
type Length1UnionExample = Length1<UnionExample>; // Error: Type 'UnionExample' does not satisfy the constraint 'readonly any[]'.
type Length2UnionExample = Length2<UnionExample>; // 2 ｜ 1
```

### 43 - easy - 实现 Exclude
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.zh-CN.md
2. 注意 extends 前元素的拆分，只有被用于泛型参数才会被拆分一个个的来判断，否则是将其作为整体来判断
```TypeScript
type MyExclude<T, A> = T extends A ? never : T
// '2' | '3'
type Result = MyExclude<'1' | '2' | '3', "1">

// A 作为整体使用 extends
type A = 's' | 'n' | 'q'
type B = 's' | 'n'
type C = A extends B ? never : A // 's' | 'n' | 'q'
```

### 189 - easy - 实现 Awaited
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.zh-CN.md
2. 注意点
- T 的限制：T extends PromiseLike<any>
- 递归处理
- PromiseLike（PromiseLike 是一个 TypeScript 类型，用于描述具有 then 方法的对象。这种对象的行为类似于 Promise，但它不需要是 Promise 的实例。PromiseLike 仅要求实现 then 方法） 是 ts 中的接口类型，不同于 Promise
```TypeScript
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer A>
  ? A extends PromiseLike<any>
    ? MyAwaited<A>
    : A
  : never
```

### 268 - easy - 实现 If（根据 true、false 返回类型）
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00268-easy-if/README.zh-CN.md
```TypeScript
// C 是 true 时返回 T，否则返回 F
type If<C extends boolean, T, F> = C extends true ? T : F
```

### 533 - easy - 实现 Concat（拼接参数）
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/README.zh-CN.md
2. 注意点
- readonly any[] 是 any[] 的父类型（可以这么理解），这里需要加 readonly 的原因在于如果传入的参数带有 readonly 的话会出现错误
- [...T, ...U]
```TypeScript
type Concat<T extends readonly any[], U extends readonly any[]> = [...T, ...U]
```

### 3057 - easy - 实现 Push（将参数 push）
1. https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md
2. 注意点
- any[] 和 unknown[] 的区别在于 unknown 会更严格
- GPT：any 是一个可以代表任意类型的类型。使用 any 时，类型检查器会对它禁用所有类型检查，允许你随意操作 any 类型的值；unknown 是 TypeScript 3.0 引入的，它表示一个类型安全的任意值。unknown 是 any 的类型安全版本，在对 unknown 类型的值进行操作之前，你必须先进行类型检查
```TypeScript
type Push1<T extends any[], U> = [...T, U]
type Push2<T extends unknown[], U> = [...T, U]
```

### 3060 - easy - 实现 Unshift（将参数 unshift）
1. https://github.com/type-challenges/type-challenges/blob/main/questions/03060-easy-unshift/README.zh-CN.md
```TypeScript
type Unshift1<T extends any[], U> = [U, ...T]
type Unshift2<T extends unknown[], U> = [U, ...T]
```

### 898 - easy - 实现 Includes
1. https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.zh-CN.md
2. 注意点
- Includes1 在于通过每次取 T 中的一个参数与 U 做对比，递归处理；同时用到了自定义的 MyEqual 类型（判断两个参数是否相等）
- Includes2 在于将 T 转为键值对的对象然后通过访问 U 看结果是不是 true（true 表示 U 包含在 T 中）
```TypeScript
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false
type Includes1<T extends readonly any[], U> = T extends [infer A, ...infer Rest]
  ? MyEqual<A, U> extends true
    ? true
    : Includes1<Rest, U>
  : false

type Includes2<T extends readonly any[], U> = {
  [P in T[number]]: true
}[U] extends true
  ? true
  : false
```

### 3312 - easy - 获取函数参数组成的类型，返回数组类型
1. https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.zh-CN.md
2. 注意点
- T extends (...args: any) => any：表示参数可以是任意传参和返回值的函数
- T extends (...args: infer A) => unknown 和 T extends (...args: infer A) => any 都差不多，只是返回值用 unknown 判断会更安全一些
```TypeScript
type MyParameters<T extends (...args: any) => any> = T extends (
  ...args: infer A
) => unknown
  ? A
  : never
```

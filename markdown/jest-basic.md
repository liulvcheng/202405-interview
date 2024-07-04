### 匹配器
1. toBe 相当于全等 ===
```JavaScript
test("测试加法交换律", () => {
  for (let x = 0; x <= 10; x++) {
    for (let y = 0; y <= 10; y++) {
      expect(x + y).toBe(y + x);
    }
  }
});
```

2. toEqual 相当于相等 ==（不检查引用）
```JavaScript
const can1 = { value: "hello" };
const can2 = { value: "hello" };
test("测试 can1 和 can2 的内容是否相等", () => {
  expect(can1).toEqual(can2);
});
```

3. toBeNull

4. toBeUndefined 等价与 toBe(undefined)

5. toBeDefined 检查是否被定义过（除 undefined 外都可通过检查）
```JavaScript
const value = 1;
test("测试值是否被定义过", () => {
  expect(value).toBeDefined();
});
```

6. toBeTruthy and toBeFalsy
```JavaScript
test("测试是否为真值", () => {
  expect(0).toBeTruthy(); // 不通过
  expect("").toBeTruthy(); // 不通过
  expect(null).toBeTruthy(); // 不通过
  expect(false).toBeTruthy(); // 不通过
  expect(undefined).toBeTruthy(); // 不通过
});

test("测试是否为假值", () => {
  expect(0).toBeFalsy(); // 通过
  expect("").toBeFalsy(); // 通过
  expect(null).toBeFalsy(); // 通过
  expect(false).toBeFalsy(); // 通过
  expect(undefined).toBeFalsy(); // 通过
});
```

7. not 表示取反操作
```JavaScript
test("测试值是否不为 aaa", () => {
  expect("hello").not.toBe("aaa");
});
test("测试值是否不为 null", () => {
  expect([]).not.toBeNull();
});
test("测试值是否不为 undefined", () => {
  expect({}).not.toBeUndefined();
});
```

8. toBeGreaterThan、toBeLessThan、toBeGreaterThanOrEqual（大于或等于）、toBeLessThanOrEqual（小于或者等于）

9. toBeCloseTo 检查浮点数是否近似相等
```JavaScript
test("测试 0.1 + 0.2 是否等于 0.3", () => {
  expect(0.1 + 0.2).toBe(0.3); // 不通过
  expect(0.1 + 0.2).toBeCloseTo(0.3); //通过
});
```

10. toMatch

11. toContain 类似数组的 includes

12. toThrow 抛出错误

### 测试异步代码
1. 测试成功的返回值
```JavaScript
import axios from "axios";
// api
export const getData = () => {
  return axios.get("http://www.dell-lee.com/react/api/demo.json");
};

import { getData } from "./index";
test("测试 getData 的返回值为 { success: true }", () => {
  return getData().then(res => {
    expect(res.data).toEqual({ success: true });
  });
});
```

2. 测试失败的返回值
```JavaScript
import { getData } from "./index";

test("测试 getData 的返回值包含 404", () => {
  return getData().catch(err => {
    // 确保 catch 的情况被执行一次
    expect.assertions(1);
    expect(err.toString()).toMatch("404");
  });
});
```

3. resolves
```JavaScript
import { getData } from "./index";

test("测试 getData 的返回值为 { success: true }", () => {
  return expect(getData()).resolves.toEqual({ success: true });
});
```

4. rejects
```JavaScript
import { getData } from "./index";

test("测试 getData 的返回值包含 404", () => {
  return expect(getData()).rejects.toMatch("404");
});
```

5. async - await
```JavaScript
import { getData } from "./index";
test("测试 getData 的返回值为 { success: true }", async () => {
  const { data } = await getData();
  expect(data).toEqual({ success: true });
});

test("测试 getData 的返回值包含 404", async () => {
  expect.assertions(1);
  try {
    await getData();
  } catch (err) {
    expect(err.message).toMatch("404");
  }
});
```

6. async - await 和 resolves - rejects 的结合使用
```JavaScript
// 在这里 async - await 和 resolves - rejects 有相同的作用
import { getData } from "./index";

test("测试 getData 返回成功", async () => {
  await expect(getData()).resolves.toEqual({ success: true });
});

test("测试 getData 返回失败", async () => {
  await expect(getData()).rejects.toMatch("404");
});
```

### 钩子函数
1. beforeEach
- beforeEach() 的作用是在每个测试用例执行之前执行里面的回调函数，如果你需要在测试开始之前对很多个测试做一些重复的工作，比如要初始化状态，你就可以使用它
```JavaScript
class Counter {
  constructor() {
    this.number = 0;
  }
  add() {
    this.number++;
  }
  minus() {
    this.number--;
  }
}
export default Counter;


import Counter from "./index";
let counter = null;

beforeEach(() => {
  counter = new Counter();
});

test("测试 counter 的 add 方法", () => {
  expect(counter.number).toBe(0);
  counter.add();
  expect(counter.number).toBe(1);
});
test("测试 counter 的 minus 方法", () => {
  expect(counter.number).toBe(0);
  counter.minus();
  expect(counter.number).toBe(-1);
});
```

2. afterEach（每个测试用例之后调用一次；对于测试代码来说可能会调用多次「因为测试代码中包含多个测试实例」）、beforeAll（所有测试用例执行前调用一次）、afterAll（...之后）

### 钩子函数的作用域
1. 通过 describe 来添加作用域；describe 可以嵌套（每一层都有自己的作用域）
```JavaScript
describe("测试分组1", () => {
  beforeAll(() => {
    console.log("测试分组1 - beforeAll");
  });
  afterAll(() => {
    console.log("测试分组1 - afterAll");
  });
  test("测试", () => {
    console.log("测试分组1 测试");
    expect(1 + 1).toBe(2);
  });
});

describe("测试分组2", () => {
  beforeAll(() => {
    console.log("测试分组2 - beforeAll");
  });
  afterAll(() => {
    console.log("测试分组2 - afterAll");
  });
  test("测试", () => {
    console.log("测试分组2 测试");
    expect(1 + 1).toBe(2);
  });
});
```

### only 关键字
1. 用来指定执行某个测试用例
```JavaScript
test.only("这个测试会被执行", () => {
  expect("A").toBe("A");
});

test("这个测试会被跳过", () => {
  expect("B").toBe("B");
});
```

### jest 的 mock
1. 测试函数是否被正常调用
```JavaScript
export const runCallback = callback => {
  callback();
};

import { runCallback } from "./index";
test("测试 runCallback", () => {
  const func = jest.fn(); // 生成 mock 函数，捕获函数的调用
  runCallback(func); // 调用 mock 函数
  expect(func).toBeCalled(); // toBeCalled 匹配器用来检查函数是否被调用过
});
```

2. 测试函数调用次数是否正确
```JavaScript
export const runCallback = callback => {
  callback();
};

import { runCallback } from "./index";
test("测试调用次数", () => {
  const func = jest.fn(); // 生成 mock 函数，捕获函数的调用
  runCallback(func); // 第一次调用 mock 函数
  runCallback(func); // 第二次调用 mock 函数
  runCallback(func); // 第三次调用 mock 函数
  expect(func.mock.calls.length).toBe(3); // 检查函数是否被调用了三次
});
```

3. 测试函数是否返回 undefined
```JavaScript
export const runCallback = callback => {
  callback();
};

import { runCallback } from "./index";
test("测试返回值", () => {
 const func = jest.fn(); // 生成 mock 函数，捕获函数的调用
  expect(runCallback(func)).toBeUndefined(); // 检查函数是否返回 undefined
});
```

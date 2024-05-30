### Promise api
- link: https://zh.javascript.info/promise-api

1. Promise.allSettled
- 浏览器不支持该 api 时
```
if (!Promise.allSettled) {
  const rejectHandler = reason => ({ status: 'rejected', reason });
  const resolveHandler = value => ({ status: 'fulfilled', value });

  // 自定义 allSettled 方法
  Promise.allSettled = function (promises) {
    const convertedPromises = promises.map(p => Promise.resolve(p).then(resolveHandler, rejectHandler));
    return Promise.all(convertedPromises);
  };
}
```

2. Promise.all


### fetch
```
fetch(url, options)
- options: 配置 item

fetch(url, {
  method: '',
  headers: {},
  body: {},
})
```

1. formData
api
- formData.append / delete / has / get / set
- 注意 append、set 的区分
- append or set 文件时需单独设置 fileName
  - formData.append(name, value)
  - formData.append(name, blob, fileName)
  - formData.set(name, value)
  - formData.set(name, blob, fileName)

2. abort fetch 的方法
- AbortController: 属性 signal、方法 abort()
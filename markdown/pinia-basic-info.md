### store
1. options api
"你可以认为 state 是 store 的数据 (data)，getters 是 store 的计算属性 (computed)，而 actions 则是方法 (methods)。"

```JavaScript
export const useCounterStore = defineStore('counter', {
  // 对应 options api 中的 data
  state: () => ({ count: 0 }),

  // 对应 options api 中的 computed
  getters: {
    double: (state) => state.count * 2,
  },

  // 对应 options api 中的 methods
  actions: {
    increment() {
      this.count++
    },
  },
})
```

2. setup api
```JavaScript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  // 返回一个对象，暴露属性和方法
  return { count, doubleCount, increment }
})
```

3. 引入的 store 支持解构写法（解构出来的值不支持响应式），通过 `.` 操作符来访问对应的变量、计算属性、方法等

4. 通过 storeToRefs 使自定义的 store 支持解构
- 解构时：state、getters 建议使用 storeToRefs；actions 直接解构
```VUE
<script setup>
  import { storeToRefs } from 'pinia'
  const store = useCounterStore()
  // `name` 和 `doubleCount` 是响应式的 ref
  // 同时通过插件添加的属性也会被提取为 ref
  // 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
  const { name, doubleCount } = storeToRefs(store)
  // 作为 action 的 increment 可以直接解构
  const { increment } = store
</script>
```

### state
1. 操作 state
- 访问：state.count
- 重置：$reset
- 变更：$patch
- 替换：
- 订阅：$subscribe

### getters
1. 访问
store.getterFunction

2. 返回函数
```JavaScript
export const useUserListStore = defineStore('userList', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

```VUE
<script setup>
import { useUserListStore } from './store'
const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// 请注意，你需要使用 `getUserById.value` 来访问
// <script setup> 中的函数
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

### actions
1. 可在 actions 中通过 this 访问 store 定义的实例

2. async await
```JavaScript
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
  },
})
```

### other
1. array function
- map、firEach
- find（找项
- findIndexOf（找项、箭头函数
- indexOf（找项、传值
- some（返回 true or false、箭头函数、有一项满足即可
- every（返回 true or false、箭头函数、每项都需满足
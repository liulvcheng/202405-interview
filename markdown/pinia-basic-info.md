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

3. store.$onAction 的用处
- 调试：你可以使用 $onAction 打印所有 action 的调用信息，这在调试时非常有用
- 日志记录：你可以记录每个 action 的调用情况，例如调用时间、传递的参数和返回结果
- 性能监测：你可以测量每个 action 执行的时间，并在需要时进行优化
```JavaScript
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    age: 0,
  }),
  actions: {
    setName(name) {
      this.name = name;
    },
    setAge(age) {
      this.age = age;
    },
    async fetchUserData() {
      // 模拟异步请求
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.setName('John Doe');
      this.setAge(30);
    },
  },
});
```
```VUE
<template>
  <div>
    <h1>User Info</h1>
    <p>Name: {{ userStore.name }}</p>
    <p>Age: {{ userStore.age }}</p>
    <button @click="fetchData">Fetch User Data</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

const userStore = useUserStore();

const fetchData = () => {
  userStore.fetchUserData();
};

// 监听 action 调用
userStore.$onAction(({ name, store, args, after, onError }) => {
  // action 调用之前触发（每次都会）
  console.log(`Action ${name} is about to be called with args:`, args);
  
  // 在 action 之后执行
  after((result) => {
    console.log(`Action ${name} was called and it returned:`, result);
  });

  // 如果 action 发生错误
  onError((error) => {
    console.error(`Action ${name} encountered an error:`, error);
  });
});

onMounted(() => {
  // Fetch data when component is mounted
  fetchData();
});
</script>
```

4. 嵌套 store（在一个 store 中引用另一个 store
```JavaScript
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `Hi ${user.name}, you have ${list.value.length} items in your cart. It costs ${price.value}.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

5. 共享 getter（在一个 getter 中调用其他的 store
```JavaScript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

6. 共享 actions（在一个 action 中调用其他 store 中的 action
```JavaScript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // 其他 action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

### 在 store 中异步 action 调用另外异步 action 的例子
- option api
```JavaScript
// stores/dataStore.js
import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    totalData: [],
    moduleData: {},
  }),
  actions: {
    // 根据 module 传参 id 调用
    async getDataByModule(moduleId) {
      // 模拟异步接口调用
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = `Data for module ${moduleId}`;
          this.moduleData[moduleId] = data;
          resolve(data);
        }, 1000);
      });
    },
    async getTotalData(moduleIds) {
      // 使用 Promise.all 调用 getDataByModule
      const promises = moduleIds.map((moduleId) => this.getDataByModule(moduleId));
      try {
        const results = await Promise.all(promises);
        this.totalData = results;
        return results;
      } catch (error) {
        console.error('Failed to fetch total data:', error);
        throw error;
      }
    },
  },
});
```
```VUE
<template>
  <div>
    <h1>Total Data</h1>
    <ul>
      <li v-for="(data, index) in totalData" :key="index">{{ data }}</li>
    </ul>
    <button @click="fetchTotalData">Fetch Total Data</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useDataStore } from './stores/dataStore';

export default {
  name: 'DataComponent',
  computed: {
    ...mapState(useDataStore, ['totalData']),
  },
  methods: {
    ...mapActions(useDataStore, ['getTotalData']),
    fetchTotalData() {
      const moduleIds = [1, 2, 3];
      this.getTotalData(moduleIds);
    },
  },
  mounted() {
    this.fetchTotalData();
  },
};
</script>
```

- composition api
```JavaScript
// stores/dataStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataStore = defineStore('data', () => {
  const totalData = ref([]);
  const moduleData = ref({});

  const getDataByModule = async (moduleId) => {
    // 模拟异步接口调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = `Data for module ${moduleId}`;
        moduleData.value[moduleId] = data;
        resolve(data);
      }, 1000);
    });
  };

  const getTotalData = async (moduleIds) => {
    // 使用 Promise.all 调用 getDataByModule
    const promises = moduleIds.map((moduleId) => getDataByModule(moduleId));
    try {
      const results = await Promise.all(promises);
      totalData.value = results;
      return results;
    } catch (error) {
      console.error('Failed to fetch total data:', error);
      throw error;
    }
  };

  return { totalData, moduleData, getDataByModule, getTotalData };
});
```
```VUE
<template>
  <div>
    <h1>Total Data</h1>
    <ul>
      <li v-for="(data, index) in dataStore.totalData" :key="index">{{ data }}</li>
    </ul>
    <button @click="fetchTotalData">Fetch Total Data</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDataStore } from './stores/dataStore';

const dataStore = useDataStore();

const fetchTotalData = async () => {
  const moduleIds = [1, 2, 3];
  await dataStore.getTotalData(moduleIds);
};

onMounted(() => {
  fetchTotalData();
});
</script>
```

### pinia 持久化插件 pinia-plugin-persist
1. link：https://seb-l.github.io/pinia-plugin-persist/

2. 使用说明：https://juejin.cn/post/7049196967770980389?searchId=20240622223820BE627E1104B3E54CEC95#heading-12

### other
1. array function
- map、forEach
  - map、forEach 无法通过诸如 return、break 等方法推出循环（try - catch 可以，但过于 hacker）
  - map、forEach 中使用 break 会报错（SyntaxError 语法错误）
  - 用 for...of 代替两者（当需要提前退出的情况，break 即可提前退出）

- some（返回 true or false、箭头函数、有一项满足即可
- every（返回 true or false、箭头函数、每项都需满足

- find（找值、返回值、传函数
- findIndex（找索引、返回索引、传函数
- indexOf（找索引、返回索引、传值
```JavaScript
const arr = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]
const result1 = arr.find((item) => item > 1)
const result2 = arr.findIndex((item) => item > 1)
const result3 = arr.indexOf(5)

console.log('1', result1) // 2
console.log('2', result2) // 1
console.log('3', result3) // 4
```
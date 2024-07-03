### Vue3 and Vue2 框架对比
- link：https://component-party.lainbo.com/#%E5%93%8D%E5%BA%94%E5%BC%8F

### provide - inject
```JavaScript
// vue3
// App.vue
<script setup>
import { ref, provide } from "vue";
import UserProfile from "./UserProfile.vue";

const user = ref({
  id: 1,
  username: "abcdefg",
  email: "abcdefg@example.com",
});

function updateUsername(username) {
  user.value.username = username;
}

provide("user", { user, updateUsername });
</script>

<template>
  <h1>欢迎回来, {{ user.username }}</h1>
  <UserProfile />
</template>

// UserProfile.vue
<script setup>
import { inject } from "vue";
const { user, updateUsername } = inject("user");
</script>

<template>
  <div>
    <h2>我的简介</h2>
    <p>用户名: {{ user.username }}</p>
    <p>邮箱: {{ user.email }}</p>
    <button @click="() => updateUsername('李四')">
      更新用户名为 李四
    </button>
  </div>
</template>


// Vue2
// App.vue
<script>
import UserProfile from "./UserProfile.vue";

export default {
  components: { UserProfile },
  provide() {
    return {
      user: Object.assign(this.user, {
        updateUsername: this.updateUsername,
      }),
    };
  },
  data() {
    return {
      user: {
        id: 1,
        username: "abcdefg",
        email: "abcdefg@example.com",
      },
    };
  },
  methods: {
    updateUsername(newUsername) {
      this.user.username = newUsername;
    },
  },
};
</script>

<template>
  <div>
    <h1>欢迎回来, {{ user.username }}</h1>
    <UserProfile />
  </div>
</template>

// UserProfile.vue
<script>
export default {
  inject: ["user"],
};
</script>

<template>
  <div>
    <h2>我的简介</h2>
    <p>用户名: {{ user.username }}</p>
    <p>邮箱: {{ user.email }}</p>
    <button @click="() => user.updateUsername('李四')">
      更新用户名为 李四
    </button>
  </div>
</template>
```

### CSS 中的 v-bind
1. CSS 中 v-bind 支持的数据类型（props、computed、ref、reactive）
```JavaScript
// Vue2 中 v-bind 不支持（需要使用第三方库「如 vue-loader」来支持实现
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>

// Vue3
<script setup>
import { ref } from 'vue'
const theme = ref({
  color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

### **computed and watch 的区别**
- link：https://cn.vuejs.org/guide/essentials/watchers.html
  - Vue 官方文档关于 watch 的内容写得很好（watch 监听参数、deep、immediate、watchEffect 等）

- 应用场景：'computed 用在根据 data 属性或者其他 computed 计算得到一个新值的情况，computed 的值一般被用在渲染中；watch 用在监听数据变化，然后做一些有副作用的操作的场景（重点在 effect，即数据变化后触发的副作用）'
- 执行过程：'在依赖的 data 属性变化后，computed 并不会重新计算新的值，而是等到访问的时候再判断，如果依赖的 data 有改动则重新计算并返回结果，如果依赖的 data 没有改动，就不计算，直接返回当前结果；依赖的数据变化后就会执行 watch 的回调'

```
<!-- chatGPT -->
computed
- 缓存机制：computed 属性的结果会被缓存，只有当依赖的数据发生变化时，才会重新计算
- 基于依赖的响应式数据：computed 属性依赖于其他响应式数据，当这些数据变化时，computed 属性会自动更新
- 简洁的语法：computed 属性适合用于简单的数据衍生和计算

watch
- 侦听特定数据变化：watch 允许侦听特定的数据变化，并在变化时执行相应的回调
- 处理副作用：watch 适合处理副作用和复杂逻辑，如异步请求和手动数据处理
- 深度观察：watch 可以通过 deep 选项实现对嵌套对象的深度观察

<!-- 可写计算属性 -->
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

<!-- 通过设置 computed 的 getter、setter 方法可以更改计算属性的值 -->
const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

### Vue2 diff 算法
- link：https://github.com/aooy/blog/issues/2#issue-215272776
  - 比较新旧节点（同级比较）；为节点添加 key 一般来说效率更高（可以通过 key 复用节点；未添加 key 时需要删除旧节点然后添加新节点，实际上新旧节点是一样的）

### Vue 中给列表添加 key 的好处和坏处是什么
1. 好处：
- 优化性能，进行高效的更新和重新渲染（如可以通过 key 复用节点；未添加 key 时需要删除旧节点然后添加新节点，实际上新旧节点是一样的）
- 维护元素状态
- 减少错误（根据 key 的唯一性可以通过 Map 或者 Object 等数据结构快速找到对应的节点）

2. 坏处
- 增加代码复杂性（需要保证每个节点的 key 是不同的会增加开发过程中的代码开销）
- 错误的 key 选择（key 选择错误、key 忘记添加或者 key 重复都可能会导致意外的行为和性能问题）

### Vuex
1. 组成部分：state、getters（可以理解为对 state 的值扩展「值来源于 state 但结果取决于具体的计算规则」或者函数操作「通过传入的参数来处理 state 用于返回用户需要的结果」）、action（异步操作；通过调用 mutation 来改变 state 的值）、mutation（同步操作）
2. state 取值：$store.stateXXX
3. action 变化：$store.dispatch('mutationXXX')
4. mutation 变化：$store.commit('actionXXX')

### 简述 Redux 和 Vuex 的设计思想
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/45
'共同点：都是为响应式编程提供的一个的可预测的状态容器，方便在复杂的应用中进行兄弟组件或子组件的状态修改；不同点：状态改变时 redux 通过纯函数（reduce）生成新的 state，而 vuex 是直接修改状态属性，最后触发相应的更新操作'

### Vue 中子组件为什么不能修改父组件传递的 props
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/60
2. 保证单向数据流（便于对数据进行跟踪，避免数据混乱）；保证单向数据流的操作一致性（一个父组件可能同时包含多个子组件，当每个子组件都可以改变 props 的值从而影响父组件的话会造成不可预料的错误和数据流混乱等问题）
3. 子组件需要用到更改的 props 时：可在子组件中拷贝一份局部数据属性（data）；可通过 comuted 对 props 进行处理
4. props 可配置属性：required、default、Type（String、Number 等）、validator
5. 可以修改的：如传入 `{ name: 'liu', age; 99 }` 时，对象上 name 和 age 的值都可以修改（本质为 props 为对象时传递的是引用

### Vue2 and Vue3 实现响应式的区别
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/90
2. Vue2：defineProperty；Vue3：proxy
3. defineProperty 和 proxy 用来实现响应式的区别
- 'Object.defineProperty 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应'
- 'Object.defineProperty 只能劫持对象的属性，从而需要对每个对象、属性进行遍历，如果属性值是对象，还需要深度遍历；Proxy 可以劫持整个对象，并返回一个新的对象'
- 'Proxy 不仅可以代理对象，还可以代理数组，还可以代理动态增加的属性'

### Vue 中父子组件生命周期触发顺序
1. 渲染触发顺序（外到内，再内到外
- 父：2 / beforeCreate、created、beforeMount；3 / onBeforeMount
- 子：2 / beforeCreate、created、beforeMount、mounted；3 / onBeforeMount、onMounted
- 父：2 / mounted；3 / onMounted

2. 父组件更新（涉及到子组件
- 父：beforeUpdate
- 子：beforeUpdate、updated
- 父：updated

3. 父组件更新（不涉及子组件
- 父：beforeUpdate、updated

4. 父组件销毁（一定伴随子组件销毁
- 父：beforeDestroy
- 子：beforeDestory、destroyed
- 父：destroyed

5. Vue3 生命周期钩子
- onBeforeMount()
- onMounted()
- onBeforeUpdate()
- onUpdated()
- onBeforeUnmount()
- onUnmounted()
- onErrorCaptured()
- onRenderTracked()
- onRenderTriggered()
- onActivated()
- onDeactivated()
- onServerPrefetch()

### 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？
1. link：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/65
2. Vuex 的设计理念就是 mutation 中处理同步操作，action 中处理异步操作（最后还是通过 mutation 来操作 state）
3. 异步操作存在完成时间不确定的情况，当多个异步操作同时进行时 state 的状态会变得难以控制（所以异步操作最后该改变 state 的状态还是通过触发 mutation 来完成）
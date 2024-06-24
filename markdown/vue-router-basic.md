### useRoute 和 useRouter
1. useRoute（$route）：用于获取当前路由的信息。返回一个响应式对象，包含当前路由的所有信息（如路径、参数、查询等）
- 当你只需要读取当前路由的信息，而不需要进行任何路由操作时，使用 useRoute

2. useRouter（$router）：用于获取路由实例。返回一个路由实例对象，可以使用该对象进行路由操作（如跳转、替换、返回等）
- 当你需要进行路由操作（如跳转「push」、替换「replace」、返回「back」等）时，使用 useRouter

3. 例子
```JavaScript
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    function navigateBasedOnRoute() {
      if (route.path === '/login') {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }

    return { navigateBasedOnRoute };
  }
};
```

### router.push()
1. 会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL

### router.replace()
1. 在导航时不会向 history 添加新记录，正如它的名字所暗示的那样——它取代了当前的条目

### router.go()
1. 例子
```JavaScript
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

### 路由守卫
1. beforeEach 和 beforeResolve
```JavaScript
// 1. 如果在 beforeEach 中检查失败并调用了 next(false) 或者重定向到其他路径，那么 beforeResolve 根本不会执行，因为导航已经被终止或重定向。
// 2. 如果 beforeEach 检查通过并调用了 next()，接着在 beforeResolve 中检查失败并调用了 next(false)，导航会被中断，不会再执行任何后续操作（包括 afterEach）。
// 3. 如果 beforeEach 和 beforeResolve 都通过并调用了 next()，导航会被确认，进入目标路由，并触发全局后置守卫 afterEach

const router = new VueRouter({
  routes: [
    {
      path: '/async',
      component: () => import('./AsyncComponent.vue')
    }
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('beforeEach: 全局前置检查');
  if (someCondition) {
    next(); // 继续导航
  } else {
    next('/login'); // 重定向
  }
});

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  console.log('beforeResolve: 组件加载完成后的检查');
  if (anotherCondition) {
    next(); // 继续导航
  } else {
    next(false); // 中断导航
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  console.log('afterEach: 导航完成后的操作');
});
```

2. 完整的路由导航流程
- 导航被触发
- 在失活的组件里调用 beforeRouteLeave 守卫
- 调用全局的 beforeEach 守卫
- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)
- 在路由配置里调用 beforeEnter
- 解析异步路由组件
- 在被激活的组件里调用 beforeRouteEnter
- 调用全局的 beforeResolve 守卫(2.5+)
- 导航被确认
- 调用全局的 afterEach 钩子
- 触发 DOM 更新
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入

### meta
- link：https://router.vuejs.org/zh/guide/advanced/meta.html
- 路由元信息
```JavaScript
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 只有经过身份验证的用户才能创建帖子
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail
        // 任何人都可以阅读文章
        meta: { requiresAuth: false },
      }
    ]
  }
]

router.beforeEach((to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
```

### 数据获取方式
1. link：https://router.vuejs.org/zh/guide/advanced/data-fetching.html

2. 导航完成后获取：在具体的页面组件生命周期中获取

3. 导航完成前获取：在具体组件 beforeRouteEnter 路由守卫中获取

### 路由导航 api
1. onBeforeRouteLeave()、onBeforeRouteUpdate() 等
```JavaScript
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm(
    'Do you really want to leave? you have unsaved changes!'
  )
  // 取消导航并停留在同一页面上
  if (!answer) return false
})

const userData = ref()

// 与 beforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate(async (to, from) => {
  // 仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

### 路由懒加载及路由打包分块
1. link：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
```JavaScript
// 懒加载
// 将 import UserDetails from './views/UserDetails.vue' 替换成
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // 或在路由定义里直接使用它
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

### 导航故障
1. link：https://router.vuejs.org/zh/guide/advanced/navigation-failures.html

2. 诸如 push、replace 等操作都是异步的，会返回一个 Promise
```JavaScript
// 使用 push 进行导航，并在导航完成后执行一些操作
router.push({ name: 'home' }).then(() => {
  console.log('Navigation to home completed');
}).catch(err => {
  console.error('Navigation to home failed:', err);
});

// 使用 replace 进行导航，并在导航完成后执行一些操作
router.replace({ path: '/login' }).then(() => {
  console.log('Navigation to login completed');
}).catch(err => {
  console.error('Navigation to login failed:', err);
});

await router.push('/my-profile')
this.isMenuOpen = false
```

3. 可在 router.afterEach 中进行全局导航故障处理
```JavaScript
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

4. 导航故障属性
- NavigationFailureType：aborted、cancelled、duplicated 等故障类型枚举
- isNavigationFailure
```JavaScript
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

router.afterEach((to, from, failure) => {
  // 任何类型的导航失败
  if (isNavigationFailure(failure)) {
    // ...
  }
  // 重复的导航
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    // ...
  }
  // 中止或取消的导航
  if (isNavigationFailure(failure, NavigationFailureType.aborted | NavigationFailureType.canceled)) {
    // ...
  }
})
```

### others
1. 嵌套路由
- 给路由加上 children

2. 命名路由
- 给路由配置加上 name 关键字

3. 路由模式
- link：https://router.vuejs.org/zh/guide/essentials/history-mode.html
- hash 模式
  - 兼容性好；不需要特殊配置；含有 `#` 不美观；seo 较差
  - 不需要特殊配置的原因：'在 Hash 模式下，URL 中的 hash（#）部分不会被发送到服务器。例如，访问 https://example.com/#/user/id 时，浏览器只会向服务器请求 https://example.com/，而 #/user/id 部分由浏览器的 JavaScript 处理。因此，服务器永远不会看到 #/user/id，它只会返回主页面 index.html，然后由前端 JavaScript 路由器解析 hash 部分并显示正确的视图'
```JavaScript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

- memory 模式
```JavaScript
import { createRouter, createMemoryHistory } from 'vue-router'
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

- html5 模式
  - 美观；seo 友好；兼容性较差；需特殊配置错误处理（防止进入不存在的路由）
  - 需要特殊配置的原因：'即使在前后端分离的模式下，仍然存在用户直接在浏览器地址栏输入 URL 或通过书签访问的情况。当用户这样做时，浏览器会发送一个完整的 HTTP 请求到服务器，而不是通过 JavaScript 路由器来处理 URL。这时，如果服务器没有适当的配置来处理这些请求并将其重定向到前端应用的入口页面，就会导致 404 错误'
    - 浏览器直接访问：用户在浏览器地址栏直接输入 URL（如 https://example.com/user/id）
    - 服务器收到请求：浏览器会向服务器请求 https://example.com/user/id 这个路径
    - 服务器处理请求：如果服务器没有配置来处理这个路径并返回前端应用的入口 HTML 文件，服务器会尝试找到对应的文件或路由。如果找不到，就会返回 404 错误

```JavaScript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

4. beforeEach、beforeResolve（to、from、next），afterEach（to、from、failure）
```JavaScript
// beforeEach or beforeResolve 使用
router.beforeEach((to, from, next) => {
  console.log('Navigating from', from.path, 'to', to.path);
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要认证的页面
    if (!isAuthenticated) {
      next('/login'); // 重定向到登录页面
    } else {
      next(); // 已认证，继续导航
    }
  } else {
    next(); // 不需要认证，继续导航
  }
});

// afterEach 使用
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

router.afterEach((to, from, failure) => {
  // 任何类型的导航失败
  if (isNavigationFailure(failure)) {
    // ...
  }
  // 重复的导航
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    // ...
  }
  // 中止或取消的导航
  if (isNavigationFailure(failure, NavigationFailureType.aborted | NavigationFailureType.canceled)) {
    // ...
  }
})
```
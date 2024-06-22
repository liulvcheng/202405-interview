### 事件处理、v-on、@click
1. 访问绑定的原生 DOM 事件
- <button @click="(event) => onClick(event)"></button>

2. 事件修饰符
- .stop（阻止事件冒泡
```VUE
<div @click="clearChange">
  // 触发两次 clear
  <el-button plain @click="clearChange">清空 1</el-button>
  // 触发一次 clear
  <el-button plain @click.stop="clearChange">清空 2</el-button>
</div>
```

- .prevent
- .once（只触发一次

### 事件绑定、v-bind、:
1. 绑定 class
- :class="{ firstClass: isFirstClass, secondClass: isSecondClass }"

- class 绑定 computed（可写相对复杂的逻辑
```JavaScript
:class="{ classObj }"

const classObj = computed(() => ({
  firstClass: isFirstClass,
  secondClass: isSecondClass,
}))
```

- array binding
:class="[activeClass, errorClass]"
:class="[ isActive ? activeClass : '', errorClass]"（三元
:class="[ { activeClass: isActive }, errorClass ]"（obj

2. 绑定 style
- css property 名推荐使用 camelCase，即 backgroundColor，fontSize
- <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

### 列表渲染、v-for
1. 解构
```VUE
<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

2. v-if、v-for 作用于统一节点时，v-if 优先级更高

3. toReversed and toSorted
[3, 2, 1].toSorted()
[3, 2, 1].toReversed()
- 不会改变原有数据的值

### 双向绑定、v-model
1. v-model.trim

### life cycle
- mounted / onMounted

### 侦听器、watch
1. 侦听对象
```JavaScript
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

2. 侦听对象属性值（需用到 getter 函数
```JavaScript
const obj = reactive({ count: 0 })

watch(
  () => obj.count,
  (count) => {
    console.log('count', count)
  },
  { deep: true },
  { immediate: true },
  // 仅侦听一次
  { once: true }
)
```

### 模板引用、ref
1. 组件挂载后才能访问到 ref 绑定的组件值，业务处理时需考虑为 null 的情况；watch 中也是

### defineProps and defineEmits
1. 两者均是在子组件中声明
```JavaScript
const props = defineProps({
  status: {
    // 类型
    type: String,
    type: [Number, String],
    // 必须
    required: true,
    // 默认值
    default: 'default',
    // type 为 Object 的默认值
    default: () => {
      return { }
    },
  }
})

// 父组件通过 @change、@delete 方式接收
const emits = defineEmits([ 'change', 'delete' ])
```

2. props
- 命名使用 camelCase，传入使用 kebab-case

- props 作为局部数据属性使用
```JavaScript
const props = defineProps(['initialCounter'])
// 初始化通过 props 赋值，不需要在 life cycle 中赋值了
const counter = ref(props.initialCounter)
```

- 会更改 props 的值
```JavaScript
const props = defineProps(['size'])
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```

3. emits
- 触发使用 camcelCase，父组件接收使用 kebab-case

emit('create', item1, item2, item3)

emit 校验
```JavaScript
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

### 项目搭建
1. 文档入手
- https://cn.vuejs.org/guide/quick-start

2. 引入 sass、sass-loader
- npm install sass sass-loader --save-dev

3. 引入 elementPlus
- npm install element-plus --save-dev

### others
1. 根据传入项快速删除数据中的某一项
```JavaScript
// indexOf() 查找全等的项
function removeTodo(todo) {
  todos.value.splice(todos.value.indexOf(todo), 1)
}
```

2. vue3 props
```JavaScript
const props = defineProps({
  status: {
    // 类型
    type: String,
    // 必须
    required: true,
    // 默认值
    default: 'default'
  }
})
```

3. sfc 中可同时包含非作用域样式和作用域样式
<style>
/* 全局样式 */
</style>

<style scoped>
/* 局部样式 */
</style>



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

2. true-value、false-value 的设置
- 适用于 v-model 绑定的值在两个状态间选择的情况
```JavaScript
// checkbox
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />

// radio（只存在两个可选的情况）
<input
  type="radio"
  v-model="selectedOption"
  :true-value="'option1'"
  :false-value="'option2'"
  name="option"
/>
```

3. 组件上的 v-model
```JavaScript
// 01 - v-model 上的参数
// 01 - App.vue
<script>
import MyComponent from './MyComponent.vue'

export default {
  components: { MyComponent },
  data() {
    return {
      // v-model 默认绑定的值（即在父组件默认设置的值双向绑定了子组件的 title 展示）
      bookTitle: 'v-model argument example'
    }
  }
}
</script>

<template>
  <h1>{{ bookTitle }}</h1>
  <MyComponent v-model:title="bookTitle" />
</template>

// 01 - MyComponent.vue
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  // 子组件 emit update:title 来更新绑定的值（更新时父子组件对应的 title 会同步更新）
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>

// 02 - 多个 v-model 绑定
// 02 - 父组件
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>

// 02 - 子组件
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  // 子组件 firstName、lastName 的改变父子组件都会自动更新
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

4. v-model 的拆分
```JavaScript
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  // 下述 emit 事件在父组件中不需要手动监听，会自动更新
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

// 01 - 父组件 v-model 绑定了 v-model:paramFirst 和 v-model:paramSecond
// 02 - 子组件可以自动更新 defineModel 的方式
// 03 - 子组件也可以通过 defineProps 的方式接收，然后通过 defineEmits 的方式触发 emit('update:paramFirst', '具体值 first') 和 ('update:paramSecond', '具体值 second') 的方式来同步更新
```

5. defineModel 的使用
```JavaScript
const title = defineModel('title', {
  required: true,
  default: 'yo',
  // 校验
  validator: value => typeof value === 'string' && value.length > 0,
  // 数据类型
  type: String,
});
```

6. v-model 的自定义修饰符
```JavaScript
// 父组件
<template>
  // capitalize 自定义修饰符
  <MyComponent v-model.capitalize="parentText" />
  <p>Parent Text: {{ parentText }}</p>
</template>

<script setup>
import { ref } from 'vue';
import MyComponent from './MyComponent.vue';

const parentText = ref('example');
</script>

// 子组件
<template>
  <div>
    <input type="text" v-model="modelValue" />
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// 定义接收的属性和事件
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// 创建内部的 model 和修饰符
const model = ref(props.modelValue);

// 初始化时对传入的数据进行转换
if (modifiers.capitalize) {
  model.value = model.value.charAt(0).toUpperCase() + model.value.slice(1);
}

// 监听 model 的变化，并同步更新父组件的数据
watch(model, (newValue) => {
  emit('update:modelValue', newValue);
});

// 监听传入的 modelValue 的变化，并同步更新内部的 model
watch(() => props.modelValue, (newValue) => {
  model.value = newValue;
});
</script>

// modifiers 能拿到所有的自定义修饰符
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>
<template>
  <input type="text" v-model="model" />
</template>
```

7. 多个 v-model 添加修饰符
```JavaScript
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>

<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName', {
  set(value) {
    return firstNameModifiers.capitalize
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : value;
  }
});

const [lastName, lastNameModifiers] = defineModel('lastName', {
  set(value) {
    return lastNameModifiers.uppercase ? value.toUpperCase() : value;
  }
});
console.log(firstNameModifiers) //  { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

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
  // 深度
  { deep: true },
  // 立即监听一次
  { immediate: true },
  // 仅侦听一次
  { once: true }
)
```

3. immediate: true
- 官方文档：'watch 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调，设置 immediate 为 true 即可'

4. watch vs watchEffect
- ![watch vs watchEffect](../interview-note/image/20240707-watch-watcheffect.png)

5. flush: 'post'
- 官方文档：'如果想在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM，你需要指明 flush: 'post' 选项'
- GPT：'通常，flush: 'post' 选项用于确保回调函数在 DOM 完成更新后才执行。这在需要确保回调函数中访问的是最新的 DOM 状态时非常有用。例如，当你需要在响应式数据变化后立即进行 DOM 操作或依赖最新的 DOM 状态时，可以使用 flush: 'post''
```JavaScript
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

6. 同步监听器
- 官方文档：'你还可以创建一个同步触发的侦听器，它会在 Vue 进行任何更新之前触发'
- GPT：'当你需要立即响应数据变化，而不等待 DOM 更新'
```JavaScript
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

7. 取消监听器
- 调用 watch、watchEffect 的返回值函数即可
```JavaScript
const unwatch = watchEffect(() => {})
// ...当该侦听器不再需要时
unwatch()
```

8. 异步监听器
- 官方文档：'注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑'
```JavaScript
// 条件式的监听逻辑
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
watch(
  () => data.value,
  () => {
    if (data.value) {
      ...
    }
  }
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
- 子组件命名使用 camelCase，父组件传入使用 kebab-case

- props 作为局部数据属性使用
```JavaScript
const props = defineProps(['initialCounter'])
// 初始化通过 props 赋值，不需要在 life cycle 中赋值了
// 适用于父组件传入的 props 子组件使用时不需要在生命周期中注册，直接将其作为参数设置给子组件的属性
const counter = ref(props.initialCounter)
```

- 会更改 props 的值（保留原始 props 不变，创建 computed 来实现符合我们要求的格式）
```JavaScript
const props = defineProps(['size'])
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```

- 官方文档：'除 Boolean 外的未传递的可选 prop 将会有一个默认值 undefined；boolean 是 false'

```JavaScript
defineProps({
  propsA: {
    // 类型
    type: String,
    // 是否必须
    required: true;
    // 默认值
    default: 'success',
    // 校验函数
    validator: (value) => {
      return ['success', 'warning', 'danger'].includes(value)
    }
  }
})
```

3. emits
- 子组件触发使用 camcelCase，父组件接收使用 kebab-case

- emit('create', item1, item2, item3)

- emit 校验
```JavaScript
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      // 通过返回 boolean 值来判断是否合法，true 表示合法，false 反之
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

- emit 调用需在 emit 声明之后
```JavaScript
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
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

### defineExpose
1. 父组件如何拿到子组件 expose 的数据
```JavaScript
<template>
  <div>
    <ChildComponent ref="childRef"></ChildComponent>
    <button @click="accessChildData">Access Child Data</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

// 通过 ref 的方式
const accessChildData = () => {
  if (childRef.value) {
    console.log(childRef.value.a); // 1
    console.log(childRef.value.b.value); // 2
  }
};
</script>
```

2. defineExpose 写在哪里
```JavaScript
<template>
  <div>{{ b }}</div>
</template>

<script setup>
import { ref } from 'vue';

// 定义要暴露的数据
const a = 1;
const b = ref(2);

// 使用 defineExpose 暴露数据
// 写在所有需要暴露出去的变量、方法前
defineExpose({
  a,
  b
});
</script>
```

3. expose 变量、computed、function
```JavaScript
// 父组件
<template>
  <div>
    <ChildComponent ref="childRef"></ChildComponent>
    <button @click="callChildMethod">Call Child Method</button>
    <p>Computed Property from Child: {{ childComputed }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

const callChildMethod = () => {
  if (childRef.value) {
    childRef.value.childMethod();
  }
};

const childComputed = computed(() => {
  return childRef.value ? childRef.value.computedValue : '';
});
</script>

// 子组件
<template>
  <div>{{ b }}</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const a = 1;
const b = ref(2);

const childMethod = () => {
  console.log('Child method called');
};

const computedValue = computed(() => {
  return `Computed: ${b.value}`;
});

defineExpose({
  a,
  b,
  childMethod,
  computedValue
});
</script>
```

4. defineExpose 适用于不需要触发事件就可以将内部属性（数据、方法等）暴露给外部适用的情况
```JavaScript
// 子组件暴露表单验证方法
// 父组件
<template>
  <div>
    <FormComponent ref="formRef"></FormComponent>
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FormComponent from './FormComponent.vue';

const formRef = ref(null);

const submitForm = () => {
  if (formRef.value) {
    const isValid = formRef.value.validateForm();
    if (isValid) {
      console.log('Form is valid, submit the form');
    } else {
      console.log('Form is invalid, show errors');
    }
  }
};
</script>

// 子组件
<template>
  <form>
    <input v-model="formData.name" placeholder="Name">
    <input v-model="formData.email" placeholder="Email">
  </form>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: ''
});

const validateForm = () => {
  return formData.value.name && formData.value.email;
};

defineExpose({
  validateForm
});
</script>
```

### hooks 封装
1. useMouse hook 封装（最简单的情况这是
```JavaScript
// hook
import { onMounted, onUnmounted, ref } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  // 节流函数
  function throttle(func, wait) {
    let timeout = null
    return function (...args) {
      if (!timeout) {
        timeout = setTimeout(() => {
          func.apply(this, args)
          timeout = null
        }, wait)
      }
    }
  }

  const updateMouse = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  // 使用节流函数包裹 updateMouse
  const throttledUpdateMouse = throttle(updateMouse, 100) // 100ms 的节流时间

  onMounted(() => {
    window.addEventListener('mousemove', throttledUpdateMouse)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', throttledUpdateMouse)
  })

  return { x, y }
}

// 使用
import { useMouse } from '../hooks/useMouse.js'
const { x, y } = useMouse()

<div class="mouse">{{ x }} - {{ y }}</div>
```

### ref 相关
1. isRef
```JavaScript
const refOne = ref(1)
const notRefTwo = 2
console.log('1', isRef(refOne)) // true
console.log('2', isRef(notRefTwo)) // false
console.log('3', unref(refOne)) // 1
console.log('4', unref(notRefTwo)) // 2
console.log('5', isRef(reactiveThree)) // false
console.log('6', unref(reactiveThree)) // { value: 3 }

// isProxy：检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理
console.log('7', isProxy(refOne.value)) // false
console.log('8', isProxy(notRefTwo)) // false
console.log('9', isProxy(reactiveThree)) // true
```

2. unRef
```JavaScript
// 可以看作如下实现（兼容 ref 数据和不是 ref 的数据
val = isRef(val) ? val.value : val
```

3. toRefs
```JavaScript
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // ...基于状态的操作逻辑

  // 在返回时都转为 ref
  return toRefs(state)
}

// 可以解构而不会失去响应性
// 不通过解构获取通过 . 操作符获取的话不会丢失响应式
const { foo, bar } = useFeatureX()
```

4. 其它响应式工具
- ![响应式 tools](../interview-note/image/20240706-响应式-tools.png)

5.  为什么通过解构赋值获取响应式的数据会存在丢失响应式的情况？
- GPT：'在 Vue 3 中，reactive 创建的响应式对象是一个 Proxy 对象，它拦截对其属性的访问和修改，以实现响应式的效果。当你对 reactive 对象进行解构赋值时，实际上只是复制了这些属性的值，而不是保持对 Proxy 对象的引用。这样，解构后的值不再受到 Proxy 的拦截，自然就失去了响应式的能力'
- GPT：'无论是数组解构还是对象解构，在涉及 reactive 对象时都会丢失响应性。这是因为解构赋值的本质是将值从原对象中复制到新的变量中，而不是保留对原对象的引用'
```JavaScript
// 对象解构
import { reactive } from 'vue';
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  });

  return state;
}
const state = useFeatureX();

const { foo, bar } = state;
console.log(foo); // 1
state.foo = 10;
console.log(foo); // 仍然是 1，不会响应变化

// 数组解构
import { reactive } from 'vue';
function useFeatureY() {
  const state = reactive([1, 2, 3]);

  return state;
}

const state = useFeatureY();
const [first, second, third] = state;
console.log(first); // 1
state[0] = 10;
console.log(first); // 仍然是 1，不会响应变化
```

6. 为什么要使用 ref
- 官方文档：'通过一个基于依赖追踪的响应式系统实现的。当一个组件首次渲染时，Vue 会追踪在渲染过程中使用的每一个 ref。然后，当一个 ref 被修改时，它会触发追踪它的组件的一次重新渲染'
- 官方文档：'在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发'
```JavaScript
// ref 可以看作是下述代码实现
// 伪代码，不是真正的实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

7. reactive
- 官方文档：'响应式对象是 JavaScript 代理（Proxy），其行为就和普通对象一样。不同的是，Vue 能够拦截对响应式对象所有属性的访问和修改，以便进行依赖追踪和触发更新'
```JavaScript
const raw = {}
const proxy = reactive(raw)

// 代理对象和原始对象不是全等的
console.log(proxy === raw) // false

// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy) // true
// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy) // true
```

8. ref 解包失败
```JavaScript
const count = ref(0)
const object = { id: ref(1) }

// 下述模版插值语法会解析失败，显示 [object Object]1
<div>{{ object.id + 1 }}</div>
// 这个不会解析失败，显示 2
<div>{{ object.id }}</div>
```

### v-bind
1. 动态绑定多个值（绑定对象）
```JavaScript
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}

<div v-bind="objectOfAttrs"></div>
```

2. 完整的指令语法
- ![指令语法](../interview-note/image/20240707-指令语法.png)

### 计算属性
1. 计算属性缓存 vs 方法
- 官方文档：'不同之处在于计算属性值会基于其响应式依赖被缓存，一个计算属性仅会在其响应式依赖更新时（且被调用时）才重新计算；方法调用总是会在重渲染发生时再次执行函数'

2. 可写计算属性
```JavaScript
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    // 根据传入的值解构
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>

// @click 会走 fullName 的 set 方法
<div class="counter" @click="fullName = `${Date.now()} ${Date.now()}`">
  {{ fullName }}
</div>
```

### 类与样式绑定
1. 绑定 computed
```JavaScript
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

<div :class="classObject"></div>
```

2. 绑定数组
```JavaScript
const activeClass = ref('active')
const errorClass = ref('text-danger')

<div :class="[activeClass, errorClass]"></div>
// 渲染结果
<div class="active text-danger"></div>

// 数组中嵌套对象，下述两种写法相同，第一种个人感觉会好一些
<div :class="[{ activeClass: isActive }, errorClass]"></div>
<div :class="{ activeClass: isActive, errorClass: true }"></div>
```

3. 组件绑定 class 且组件存在多个根节点时需指定绑定的根节点
```JavaScript
// MyComponent 模板使用 $attrs 时，指定 p 标签对绑定 class
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>

<MyComponent class="baz" />

// 下述为实际渲染结果
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

### 条件渲染
1. v-if 和 v-show
- ![if 和 show 的区别](../interview-note/image/20240707-if-show.png)

### 列表渲染
1. v-for 添加 key 的作用
- 官方文档：'以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 key attribute'

2. v-for 遍历 Array 和 Object
```JavaScript
<ul>
  <li v-for="(value, key, index) in myObject" :key="value">
    {{ key }} - {{ value }} - {{ index }}
  </li>
</ul>
<hr />
<ul>
  <li v-for="({ key, value }, index) in list" :key="key">
    {{ key }} - {{ value }} - {{ index }}
  </li>
</ul>

const list = reactive([
  { key: 1, value: '111' },
  { key: 2, value: '222' },
  { key: 3, value: '333' },
])
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10',
})
```

3. 数组变化方法，如 v-for 绑定的是 Array 的话会有影响
- pop、push、shift、unshift、sort、reverse、splice
- 计算属性或其他引用原始数据的时候不应该改变原始数组，简单的数据可以通过 ... 拷贝一份
```JavaScript
return numbers.reverse() // 不推荐
return [...numbers].reverse() // 推荐
```

### 事件处理
1. 在内联事件中处理器中访问原生 DOM 事件
```JavaScript
// 使用特殊的 $event 变量
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

// 使用内联箭头函数
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>

function warn(message, event) {
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

### 模版引用
1. 可以通过 DOM 上绑定的 ref 获取到 DOM 的一些属性、方法或者对 DOM 进行一些操作
- 官方文档：'注意，你只可以在组件挂载后才能访问模板引用（即 onMounted 生命周期中访问或者在 onBeforeMount 中通过 nextTick 来访问）'

2. v-for 上的模版引用
- 官方文档：'当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素；ref 数组并不保证与源数组相同的顺序；需要注意 v-for 渲染的项有没有通过 v-if 或者 v-show 隐藏的情况'

### 组件注册
1. 全局注册
- 全局注册的组件不需要在具体业务中引用
- 全局注册的问题
  - 官方文档：'全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中'
  - 官方文档：'全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性'
  - 与上述相反局部注册的优点就是 tree-shaking 更加友好，依赖关系更加明确
```JavaScript
// 01 - 直接写 template 模版
import { createApp } from 'vue'
const app = createApp({})
app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)

// 02 - import 导入的方式注册
import MyComponent from './App.vue'
app.component('MyComponent', MyComponent)

// 03 - 链式注册
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

2. 局部注册
```JavaScript
// 01 - setup 的方式
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>

// 02 - setup return 的方式，需要手动注册
import ComponentA from './ComponentA.js'
export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

### props
1. 命名规范
```JavaScript
// 父传子使用 kebab-case
<MyComponent greeting-message="hello" />

// 子注册、使用 camelCase
defineProps({
  greetingMessage: String
})
<span>{{ greetingMessage }}</span>
```

### 异步组件
1. 异步组件的注册
```JavaScript
// 01 - 全局注册
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))

// 02 - 局部注册
<script setup>
import { defineAsyncComponent } from 'vue'
// 官方文档：'AdminPage 是一个外层包装过的组件，仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载'
const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>
<template>
  <AdminPage />
</template>
```

2. 错误处理
```JavaScript
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

### 组合式函数
1. 不同 hooks 之间的组合
```JavaScript
// event.js
import { onMounted, onUnmounted } from 'vue'
export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })
  return { x, y }
}
```

2. 响应式 hook
```JavaScript
// fetch.js
import { ref } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}

const url = ref('/initial-url')
const { data, error } = useFetch(url)
// 这将会重新触发 fetch
url.value = '/new-url'
```

3. option api 中使用 hook
```JavaScript
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

### 内置组件 - Transition
1. 官方文档：'<Transition> 仅支持单个元素或组件作为其插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素'

2. 为过渡效果命名
```JavaScript
<Transition name="fade">
  ...
</Transition>

// fade 开头
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

3. transform 和 opacity 的好处
- 官方文档：'他们在动画过程中不会影响到 DOM 结构，因此不会每一帧都触发昂贵的 CSS 布局重新计算'
- 官方文档：'大多数的现代浏览器都可以在执行 transform 动画时利用 GPU 进行硬件加速'
- 官方文档：'相比之下，像 height 或者 margin 这样的属性会触发 CSS 布局变动，因此执行它们的动画效果更昂贵，需要谨慎使用'

4. 初次渲染时添加过渡效果
```JavaScript
// 添加 appear 属性
<Transition appear>
  ...
</Transition>
```

5. 组件间的过渡
```JavaScript
// mode 设置为 out-in 可以理解为过渡效果为原有的先 out（消失）新加的在 in（添加）
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

6. 计数器自动增加过渡效果
```JavaScript
<script setup>
import { ref } from 'vue';

const count = ref(0);

// 每 1000ms 变化一次
setInterval(() => {
  count.value++;
}, 1000);
</script>

<template>
  <div class="wrapper">
  // out-in：先 out 在 in，默认是 out、in 效果同时触发
  <Transition mode="out-in">
    // 为需要应用过渡效果的 DOM 绑定 key，当 key 变化时会自动触发过渡效果
    <span :key="count">{{ count }}</span>
  </Transition>
  </div>
</template>

<style scoped>
span{
  font-size: 4rem;
}
.wrapper{
  position:relative;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  position: absolute;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```

7. 什么条件下会触发过渡效果
- 官方文档：'v-if、v-show、Component 上绑定的 is 改变时、DOM 元素绑定的 key 变化时'

### 内置组件 - TransitionGroup
1. 官方文档：'<TransitionGroup> 是一个内置组件，用于对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果'

2. 和 Transition 的区别
- ![TransitionGroup](../interview-note/image/20240708-transitiongroup.png)

### 内置组件 - KeepAlive
1. 最大缓存组件数
```JavaScript
// 设置 max
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

2. 缓存实例的生命周期
- 官方文档：'当一个组件实例从 DOM 上移除但因为被 <KeepAlive> 缓存而仍作为组件树的一部分时，它将变为不活跃状态而不是被卸载。当一个组件实例作为缓存树的一部分插入到 DOM 中时，它将重新被激活；可通过 onActivated 和 onDeactivated 这两个生命周期来触发一些副作用'
- 官方文档：'onActivated 在组件挂载时也会调用，并且 onDeactivated 在组件卸载时也会调用'
```JavaScript
// 注意下述两者生命周期钩子的触发时机
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>
```

3. exclude、include 显性指定哪些组件该被缓存或者不该被缓存
- 取值为数组、逗号分开的字符串、正则表达式
```JavaScript
<template>
  <div>
    <button @click="currentComponent = 'ComponentA'">Show Component A</button>
    <button @click="currentComponent = 'ComponentB'">Show Component B</button>
    <button @click="currentComponent = 'ComponentC'">Show Component C</button>
    <keep-alive :exclude="['ComponentC']">
    {/* <keep-alive :include="['ComponentC']"> */}
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';
import ComponentC from './ComponentC.vue';

export default {
  components: {
    ComponentA,
    ComponentB,
    ComponentC
  },
  data() {
    return {
      currentComponent: 'ComponentA'
    };
  }
};
</script>
```

### 内置组件 - teleport
1. teleport 类似于 elementUI 中的 el-dialog 组件
- 官方文档：'<Teleport> 接收一个 to prop 来指定传送的目标。to 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用就是告诉 Vue“把以下模板片段传送到 body 标签下”'
- 注意 to 的赋值使用
```JavaScript
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  // 通过 Teleport 将需要应用的 DOM 包裹，不需要用户自己考虑 DOM 的位置、z-index 这种
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

### 内置组件 - Suspense（实验性阶段）
1. async setup
```JavaScript
// 01 - setup 手动 return 的方式
export default {
  // setup 函数可以是异步的
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}

// 02 - setup 语法糖的方式
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

2. 自带的插槽
- 官方文档：'<Suspense> 组件有两个插槽：#default 和 #fallback。两个插槽都只允许一个直接子节点。在可能的时候都将显示默认槽中的节点。否则将显示后备槽中的节点'

### others
1. 根据传入项快速删除数据中的某一项
```JavaScript
// indexOf() 查找全等的项
function removeTodo(todo) {
  todos.value.splice(todos.value.indexOf(todo), 1)
}
```

### 单文件组件
1. 为什么要使用 sfc
- ![为什么要使用 sfc](../interview-note/image/20240708-why-need-sfc.png)

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



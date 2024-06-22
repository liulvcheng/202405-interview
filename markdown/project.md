### 政务后勤
**食堂管理模块 PC 端：**
1. 食堂管理
- 食堂管理：关联食堂类型来适配工作流，每个食堂类型对应特定的工作流模版；食堂类型关联的工作流用于包厢预订
- 食堂表单关键点：
  - 可订餐时间：可配置为法定节假日及调休校准，以此来实现假期等特殊日子食堂不会被预订（避免脏数据）
  - 餐次分为中晚餐；两者时间段互不干涉并且覆盖 24 小时

2. 盒饭管理
- 关联食堂以此来匹配后续 app 根据食堂来点餐的需求
- 盒饭表单关键点：
  - 可预约时间：可配置为周一到周日；有限制份数的选项，是的话可自定义限制，否的话是无限份数

3. 自制品管理
- 关联食堂以此来匹配后续 app 根据食堂来点餐的需求
- 自制品表单关键点：
  - 可下单时段：可选不限、自定义（24 小时）、跟随食堂订餐时段（具体分为中餐、晚餐时段）
  - 可预约时间：可配置周一到周日；有限制份数的选项，是的话可自定义限制（最大为 99999 份，同时每人有最大限制份数小于 `Math.min(自定义限制份数, 999)`），否的话是无限份数（每人最大限制份数为 `Math.min(无限份数, 999)`）

4. 配送点管理
- 关联自制品（盒饭需要人工配送）
- 配送点具体到楼层（每个配送点间位置隔离，即点 1 选择了 A 栋 1 层，点 2 就无法选择该楼层）
  - 配送点间互不干涉实现（具体实现为新添加配送点时需禁用掉已添加过配送点的楼层
  - ![el-tree-disable-node1](../interview-note/image/el-tree-disabled-node-1.png)
  - ![el-tree-disable-node2](../interview-note/image/el-tree-disabled-node-2.png)
  - ![el-tree-disable-node3](../interview-note/image/el-tree-disabled-node-3.png)

5. 包厢管理
- 关联食堂 -> 关联食堂类型 -> 关联工作流模版
- 包厢表单注意点：
  - 可预约时间：可配置为法定节假日及调休校准，以此来实现假期等特殊日子包厢不会被预订（避免脏数据）
  - 餐次：可以配置中晚餐的用餐时间段（互不干涉）；可以配置中晚餐的最晚取消时间，该时间前都可以取消包厢预订（最晚取消时间需小于等于该餐次时间段的结束时间）
  - 餐标类型：可选自定义与非自定义；非自定义的话接待类型、餐标名称、用餐标准都可以从配置模版中选择；自定义的话上述字段对应的值都是可动态配置的

**食堂管理模块 APP 端：**
1. 包厢预订
- 顶部有日期选择器（scroll bar）；展开显示月、合上显示周，左右滑动可以切换月或周，本周本月前的日期不可选择（避免出现脏数据）；已过的日期置灰显示且不可选择
- 列表展示所有可选包厢（分中晚餐）；已被预订的餐次置灰
- 表单填写完成后走预订逻辑，同时自动触发工作流（包厢与食堂绑定，每个食堂有对应的食堂类型，每个食堂类型对应单独的工作流流程，每个工作流流程对应固定角色的人员审批）

2. 点餐
- 盒饭、自制品点餐（两者不可以同时，在于盒饭需要人工配送）
- 配送地址设置（每个用户对于每个食堂可配置配送地址，由该用户组织部门、具体配送点「即具体的楼栋楼层」、具体房间、备注组成）
- 支付设置
  - 一卡通绑定：具体需要关联长沙银行的服务，绑定完成后向卡内添加余额
  - 一卡通支付：用户账户绑定一卡通后可以用里面的余额支付；需输入用户密码判断（六位，具体通过接口判断正确性）
    - 支付失败有 5 分钟的重试时间（定时器实现）；可重试订单在订餐页面置顶显示
- 自制品下单成功后需要人工去窗口取餐，所以会有取餐码、取餐时间等

3. 工作流
- 简单的配置模版自动提交
- 复杂的需要自己选模版、选具体工作流程、选工作流程中的人这样

**通知管理模块：**
1. 通知管理
- 通知关联到人；可添加通知附件

2. 通知查阅
- 指定到的人可以在后台、app 查看通知，查看后待阅通知数减 1（通过调用接口实现）
- 单独页面查看（符合现代网页新闻查看要求）
- 通知查看详情：可以针对每个通知查看其被查阅的人数（具体哪些人）、查看与未查看比例

3. app 首页有最新 5 条待阅通知，点击跳转按查看通知逻辑走

4. app 有专门的通知 tab 栏
- 可根据通知类型查看所有通知（scroll tab 实现）
- 可根据关键字搜索

5. app 我的页面可查看待阅、已阅通知
- 主要起到历史记录的效果

### 党务学习
**会议管理模块 PC 端：**
1. 会议室管理
- 会议室表单注意点：
  - 配套服务可以自定义每个会议室的服务（服务类型、服务人员「会议服务人员角色」、服务内容等）
  - 会议室绑定坐席设置（坐席形状：环形、圆桌、阶梯；坐席横纵列；坐席配置：屏幕、窗户、空调、门洞等）
  - 坐席可以预览（通过 pixi.js 实现，pixi.js 是一个 js 图形库，可以实现动画、图形等效果）

2. 会议预约
- 会议信息
  - 针对需要预订的会议室选择时间范围（已被预订过的时间段置灰）
  - 会议提醒：克设定会议开始前某小时某分前提醒（发短信给参会人员的手机号）

- 会议议程
  - 在会议的时间段内可以安排议程（议程名称、开始结束时间、议程关联人）
  - 可对议程进行排序、各项议程间时间段互不干涉（校验处理）

- 坐席安排
  - 左右布局（左边是人员列表、右边是坐席预览），可以鼠标拖动人员将其排在右边坐席图上，坐席图上已被排座的人员右键可以自定义操作（删除、固定等）
  ```HTML
  <!-- html 上禁用：@contextmenu.prevent -->
  <div
    @click="
      () => {
        console.log('here')
      }
    "
    @contextmenu.prevent
  >
    {{ 'here' }}
  </div>
  ```
  ```JavaScript
  // js 上禁用
  <p id="noContextMenu">这个段落右键菜单已被禁用。</p>
  <p>但是这个段落没有被禁用。</p>

  noContext = document.getElementById("noContextMenu");
  noContext.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  ```

- 投票管理
  - 可以对会议创建投票（增删改查）

- 服务管理
  - 可以给会议安排具体服务
  - 可根据服务的状态来进行不同的操作（增删改查、评价等）

- 签到信息
  - 统计参会人员的签到记录
  - 可以下载二维码让用户通过小程序扫码签到
  - 可以导出会议签到表进行材料归档

3. 服务记录（对会议服务进行管理）
- 可查看具体的会议服务详情、取消、接单（仅限角色为会议服务人员）等操作

### 招商引资小程序
1. PC 端招商名片
- 名片表单注意点：
  - 中文名英文名：英文名需做限制（可以是多个空格分开的大小写字母，前后空格不做限制）
    - 可支持：张三 - Zhang San、刘铁柱 - Liu Tiezhu、司马相南 - Sima Xiangnan（每个字段间需单个空格区分、前后空格不限制
    - 搭配 trim()、trimStart()、trimEnd() 使用
    ```JavaScript
    // 适配多个词
    /^[A-Za-z]+(?: [A-Za-z]+)*$/

    // 适配两个词，即名和姓
    /^[A-Za-z]+ [A-Za-z]+$/
    ```
  - 地图选点操作：文本地址输入和地图选点，两者可不匹配但都必填；每次地图选点后同步更新文本地址（后续文本地址修改不限制）；地图选点后再次选点时需回显之前的选点位置；可通过搜索框模糊搜索地点
  - 腾讯地图 api 文档：https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map Picker</title>
    <!-- 引入腾讯地图 SDK -->
    <script src="https://map.qq.com/api/gljs?v=1.exp&key=YOUR_TENCENT_MAP_KEY"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  ```

  ```VUE
  <!-- MapPicker.vue 组件 -->
  <template>
    <div>
      <!-- 搜索输入框 -->
      <input v-model="searchQuery" @input="searchPlace" placeholder="Search place" />
      <!-- 地图容器 -->
      <div ref="mapContainer" style="width: 100%; height: 400px;"></div>
      <!-- 确认选点按钮 -->
      <button @click="confirmSelection">Confirm Selection</button>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, watch } from 'vue';

  // 定义接收的 props
  const props = defineProps({
    initialPosition: {
      type: Object,
      default: () => ({ lat: 39.9042, lng: 116.4074 }) // 默认位置为北京
    }
  });

  // 定义触发的事件
  const emit = defineEmits(['update:position']);

  // 定义引用的地图容器
  const mapContainer = ref(null);
  const searchQuery = ref('');
  const selectedPosition = ref(props.initialPosition);

  let map;
  let marker;

  // 组件挂载后初始化地图
  onMounted(() => {
    // 初始化地图
    map = new TMap.Map(mapContainer.value, {
      center: new TMap.LatLng(selectedPosition.value.lat, selectedPosition.value.lng),
      zoom: 12
    });

    // 在地图上添加可拖拽的标记
    marker = new TMap.MultiMarker({
      map,
      geometries: [{
        position: new TMap.LatLng(selectedPosition.value.lat, selectedPosition.value.lng),
        properties: {
          title: "Drag me"
        }
      }],
      draggable: true
    });

    // 拖动标记结束时更新选中的位置
    marker.on('dragend', event => {
      selectedPosition.value = {
        lat: event.geometry.position.lat,
        lng: event.geometry.position.lng
      };
    });
  });

  // 搜索地点并在地图上更新位置
  const searchPlace = () => {
    if (!searchQuery.value) return;

    const searchService = new TMap.service.Search({
      complete: result => {
        if (result.detail.pois.length) {
          const location = result.detail.pois[0].location;
          map.setCenter(location);
          marker.setGeometries([{
            position: new TMap.LatLng(location.lat, location.lng)
          }]);
          selectedPosition.value = { lat: location.lat, lng: location.lng };
        }
      }
    });

    // 执行搜索
    searchService.search({
      keyword: searchQuery.value,
      boundary: 'region(北京,0)'
    });
  };

  // 确认选点并发送事件
  const confirmSelection = () => {
    emit('update:position', selectedPosition.value);
  };
  </script>

  <style scoped>
  /* 添加任何附加样式 */
  </style>
  ```

  ```VUE
  <!-- Main.vue 组件 -->
  <template>
    <div>
      <form @submit.prevent="handleSubmit">
        <div>
          <!-- 地址输入框 -->
          <label for="address">Address</label>
          <input id="address" v-model="form.address" required />
        </div>
        <div>
          <!-- 地图选点组件 -->
          <label for="map">Map Picker</label>
          <MapPicker :initialPosition="form.mapPosition" @update:position="updateMapPosition" />
        </div>
        <!-- 提交按钮 -->
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import MapPicker from './components/MapPicker.vue';

  // 定义表单数据
  const form = ref({
    address: '',
    mapPosition: { lat: 39.9042, lng: 116.4074 } // 默认位置为北京
  });

  // 更新地图选点位置
  const updateMapPosition = position => {
    form.value.mapPosition = position;
  };

  // 表单提交处理函数
  const handleSubmit = () => {
    if (form.value.address && form.value.mapPosition) {
      console.log('Form submitted:', form.value);
    } else {
      alert('Please fill in all fields.');
    }
  };
  </script>

  <style scoped>
  /* 添加任何附加样式 */
  </style>
  ```

2. 小程序端地图结合操作
- components/MapPicker.vue
```VUE
<template>
  <view>
    <u-input v-model="searchQuery" placeholder="搜索地点" @confirm="searchLocation" />
    <u-select v-model="mapType" :options="mapTypes" @change="changeMapType" />
    <u-select v-model="overlayType" :options="overlayTypes" @change="changeOverlayType" />
    <map
      id="map"
      :longitude="longitude"
      :latitude="latitude"
      :scale="scale"
      :show-location="true"
      :layers="mapType"
      :covers="covers"
      @regionchange="handleRegionChange"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { uInput, uSelect } from 'uview-plus';

const searchQuery = ref('');
const mapType = ref('vector');
const overlayType = ref('block');
const longitude = ref(113.323);
const latitude = ref(23.097);
const scale = ref(16);
const covers = ref([]);

const mapTypes = [
  { text: '平面图', value: 'vector' },
  { text: '卫星图', value: 'satellite' }
];

const overlayTypes = [
  { text: '地块', value: 'block' },
  { text: '楼宇', value: 'building' },
  { text: '项目', value: 'project' }
];

onMounted(() => {
  initMap();
});

function initMap() {
  const mapCtx = wx.createMapContext('map');
  // 初始地图设置等
}

function changeMapType(value) {
  mapType.value = value;
  // 更新地图类型
}

function changeOverlayType(value) {
  overlayType.value = value;
  updateCovers();
}

function updateCovers() {
  // 根据 overlayType 更新地图覆盖物
  covers.value = getOverlayData(overlayType.value);
}

function getOverlayData(type) {
  // 模拟返回不同类型的数据
  switch (type) {
    case 'block':
      return [{ id: 1, longitude: 113.323, latitude: 23.097, iconPath: '/resources/block.png' }];
    case 'building':
      return [{ id: 2, longitude: 113.323, latitude: 23.097, iconPath: '/resources/building.png' }];
    case 'project':
      return [{ id: 3, longitude: 113.323, latitude: 23.097, iconPath: '/resources/project.png' }];
  }
}

function handleRegionChange(e) {
  // 处理地图区域变化事件
}

function searchLocation() {
  const plugin = requirePlugin("tencentmap");
  plugin.search({
    keyword: searchQuery.value,
    success: function(res) {
      const location = res.data[0].location;
      longitude.value = location.lng;
      latitude.value = location.lat;
      // 聚焦到搜索结果
    }
  });
}
</script>

<style scoped>
/* 添加样式 */
</style>
```

- pages/index/index.vue
```VUE
<template>
  <view class="container">
    <map-picker />
  </view>
</template>

<script setup>
import MapPicker from '@/components/MapPicker.vue';
</script>

<style scoped>
/* 添加样式 */
</style>
```

- 配置 sdk
```JSON
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "WeChat"
  },
  "plugins": {
    "tencentmap": {
      "version": "1.0.0",
      "provider": "wx76a9a06e5b4e693e"
    }
  }
}
```
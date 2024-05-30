### 实现吸顶效果

1. css
```
position: sticky;
```

2. js 实现
```
<style>
  .sticky {
    background-color: #f1f1f1; /* 吸顶时的背景颜色 */
    padding: 10px;
    font-size: 20px;
  }
</style>


<p>这是一些文本，用来模拟页面滚动效果。</p>
<div id="stickyElement" class="sticky">我会在滚动时吸顶</div>
<p>这是更多的文本，用来撑长页面。</p>

<script>
// 获取需要吸顶的元素
var stickyElement = document.getElementById('stickyElement');
// 获取元素初始位置
var stickyElementTop = stickyElement.offsetTop;

// 监听页面滚动事件
window.onscroll = function() {
  // 如果滚动位置超过了元素初始位置，则将元素定位设为 fixed
  if (window.pageYOffset >= stickyElementTop) {
    stickyElement.style.position = 'fixed';
    stickyElement.style.top = '0';
  } else {
    // 否则恢复元素的初始定位
    stickyElement.style.position = 'static';
  }
};
</script>
```


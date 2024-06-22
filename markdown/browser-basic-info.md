### window.location
1. location
- https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location
- location.reload()
- location.replace()

2. window.location
- https://developer.mozilla.org/zh-CN/docs/Web/API/Location
- href
- host
- protocol（http、https

```JavaScript
// Create anchor element and use href property for the purpose of this example
// A more correct alternative is to browse to the URL and use document.location or window.location
var url = document.createElement("a");
url.href =
  "https://developer.mozilla.org/en-US/search?q=URL#search-results-close-container";
console.log(url.href); // https://developer.mozilla.org/en-US/search?q=URL#search-results-close-container
console.log(url.protocol); // https:
console.log(url.host); // developer.mozilla.org
console.log(url.hostname); // developer.mozilla.org
console.log(url.port); // (blank - https assumes port 443)
console.log(url.pathname); // /en-US/search
console.log(url.search); // ?q=URL
console.log(url.hash); // #search-results-close-container
console.log(url.origin); // https://developer.mozilla.org
```

### window height 相关
1. window.innerHeight（除开地址栏、书签栏）;window.screen.height（整个高度，不同浏览器不同）；document.body.clientHeight（元素高度）

### window 编码相关
- window.encodeURI() 编码
- window.decodeURI() 解码
- window.encodeURIComponent() 编码
- window.decodeURIComponent() 解码

- base64 编码（不适用于 unicode 编码；会报错（Uncaught DOMException: Failed to execute 'atob' on 'Window': The string to be decoded contains characters outside of the Latin1 range.）
- window.btoa() 编码
- window.atob() 解码

- 编码 url
- window.encodeURI()
- window.decodeURI()

- 'encodeURI 用来编码 URI，而 encodeURIComponent 用来编码 URI 中的 query 参数，以避免服务器收到不可预知的参数'

### window scroll
- scroll()、scrollBy()、scrollTo()

### window.onload() and window.addEventListener('load', () => { ... })
- 多个 onload 会被覆盖；addEventListener 不会（可对事件添加多个监听器）

```JavaScript
addEventListener 的第三个参数
window.addEventListener(
  'load',
  () => { ... },
  once
)
```

### copy、cut、paste 事件
```
window.addEventListener('copy', (event) => {
  console.log('event', event)
  event.preventDefault()
})
```

### contextmenu
- 用于禁用右键事件等

```JavaScript
// 通过绑定事件
<p @contextmenu.prevent>这个段落右键菜单已被禁用。</p>
<p>但是这个段落没有被禁用。</p>

// 通过元素监听
<p id="noContextMenu">这个段落右键菜单已被禁用。</p>
<p>但是这个段落没有被禁用。</p>

const noContext = document.getElementById("noContextMenu");

noContext.addEventListener("contextmenu", (e) => {
  console.log('contextmenu')
  // preventDefault 禁用操作
  e.preventDefault();
});
```



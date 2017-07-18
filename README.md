# nodejs-crawler
一个 nodejs 的爬虫示例，此处用于抓取 hexo 所有主题，并排序输出关注（star）排行

### 使用方法
1. 执行指令 `node server.js`
2. 到浏览器访问 `localhost:3000`

### 背景
玩 hexo 时苦于找不到好的主题，上知乎一搜，有人通过爬虫抓取了所有主题的排行版，但发帖时间是 2015 年的，已经过期很久。人家可以爬虫，我也可以，所以作死的开启了爬虫之路

### 启发
#### 1. request VS SuperAgent
一开始按照【参考资料1】使用 SuperAgent，发现爬虫非常慢，导致浏览器直接超时不访问了。还以为是 github 慢，开户了科学上网工具，效果一般。不得不亲自“爬虫”，访问 github 页面。实际上，页面反应很快，或者说 document 加载很快，是其他资源加载慢了。SuperAgent 估计是等到页面 loaded 了之后才返回数据。
所以，有没有工具像 linux 里的 curl 合集，可以只请求 document 呢？百度下来找到了 requrest，请求确实快了很多，问题解决。

那是不是说 request 就比 SuperAgent 好呢？分情况。如果爬虫的数据在 document 里，用 request 可以明显加快爬虫效率；如果爬虫的数据是页面 AJAX 请求得到的，就需要等到页面加载完再爬虫，此时就需要 SuperAgent 了。

#### 2. 事件处理 与 函数
第一次看到事件时，一直以为事件就和函数一样，都是执行一项任务。接触爬虫后发现，事件的真正作用在异步（异步并非并发）！！

刚开始开发爬虫时用的是函数，发现爬虫一直是爬完一个再爬另一个，效率非常慢（函数是顺序执行的）。这里才理解爬虫例子中使用事件不是没有原因的，异步才是使用 nodejs 爬虫最大的好处。

### 参考资料
1. [【nodeJS爬虫】前端爬虫系列 -- 小爬「博客园」](http://www.cnblogs.com/coco1s/p/4954063.html)
2. [request 使用说明 github](https://github.com/request/request)
3. [Nodejs读写文件](http://www.cnblogs.com/lengyuhong/archive/2012/02/18/2265164.html)

# nodejs-crawler
一个 nodejs 的爬虫示例，此处用于抓取 hexo 所有主题，并排序输出关注（star）排行

### 使用方法
1. 执行指令 `node server.js`
2. 到浏览器访问 `localhost:3000`

### 背景
玩 hexo 时苦于找不到好的主题，上知乎一搜，有人通过爬虫抓取了所有主题的排行版，但发帖时间是 2015 年的，已经过期很久。人家可以爬虫，我也可以，所以作死的开启了爬虫之路

### 启发
1. requrest VS SuperAgent
一开始按照【参考资料1】使用 SuperAgent，发现爬虫非常慢，导致浏览器直接超时不访问了。还以为是 github 慢，开户了科学上网工具，效果一般。不得不亲自“爬虫”，访问 github 页面。实际上，页面反应很快，或者说 document 加载很快，是其他资源加载慢了。SuperAgent 估计是等到页面 loaded 了之后才返回数据。
所以，有没有工具可以只请求 document 呢，

### 参考资料
1. [【nodeJS爬虫】前端爬虫系列 -- 小爬「博客园」](http://www.cnblogs.com/coco1s/p/4954063.html)
2. [request 使用说明 github](https://github.com/request/request)
3. [Nodejs读写文件](http://www.cnblogs.com/lengyuhong/archive/2012/02/18/2265164.html)

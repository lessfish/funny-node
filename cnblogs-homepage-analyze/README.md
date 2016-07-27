对博客园首页不同时间段发表的文章的阅读量进行分析。（将 front 文件夹放入 Apache 的 www 文件夹下）

不同时间段发文总数：

1. `node index.js` 启动服务
2. 客户端输入 `http://localhost/front/total.html`

不同时间段发文平均阅读量：

1. `node index.js` 启动服务
2. 客户端输入 `http://localhost/front/average.html`

实现过程参考 <http://www.cnblogs.com/zichi/p/5115754.html>
[上文](http://www.cnblogs.com/zichi/p/5115754.html) 我们说到用 node 爬了博客园 20*150 条数据，但是这 150 次请求完全是并发的，如果某些网站有 "反爬" 机制，就很有可能封锁你的 IP。这样的情况下我们就可以使用 [async](https://github.com/caolan/async) 模块。

还是以具体例子来说明，一直爬博客园也不好，我们换个爬爬。在 [Nodejs - 如何用 eventproxy 模块控制并发](http://www.cnblogs.com/zichi/p/4913133.html) 一文中介绍了如何用 eventproxy 模块并发完成 10 条请求，文中爬的是 [zoj](http://acm.zju.edu.cn/onlinejudge/)，后来发现 zoj 有时网络太差，便改爬 [hdoj](http://acm.hdu.edu.cn/)，完整代码可以猛戳 [这里](https://github.com/hanzichi/practice/blob/master/node/%E5%A4%9A%E9%A1%B5%E9%9D%A2%E6%8A%93%E5%8F%96%EF%BC%88%E5%90%8C%E6%97%B6%E5%B9%B6%E5%8F%91%EF%BC%89/index.js)，具体实现可以参考上文。今天我们要完成的事情还是类似，爬取 hdoj 1000-1099 100道题目的最优解提交时间，并发量控制为 5（本来想爬取最优解的用户 id，发现 hdoj 用的是 gbk，中文会乱码，这个问题暂时放一放）。

主要用到的是 async 的 `mapLimit(arr, limit, iterator, callback)` 接口。用法很简单，直接看代码：

    // 并发量控制为 5 
    async.mapLimit(urls, 5, function (url, callback) {
      fetchUrl(url, callback);
    }, function (err, result) {
      res.send(result);
    });

第一个参数 urls 为数组，保存了需要爬取页面的 100 个 url，第二个参数 5 表示并发爬取数量为 5，第三个参数是迭代函数（每个 url 需要执行这个函数），其第一个参数 url，是 urls 数组的每个 item，第二个参数 callback 与 mapLimit 方法第四个参数有关，callback 会往 result 参数里存放数据。如何理解？callback 是第三个参数 iterator 的回调，以爬虫为例，爬完页面肯定会分析一些数据，然后保存，执行 callback 函数就能把结果保存在 result（第四个参数函数中的参数） 中。

说完 mapLimit，我们从头开始这次爬虫。

首先，我们采集 100 个需要爬取页面的 url，保存在 urls 数组中：

    // 需要爬的网址
    function getUrls() {
      var urls = []
        , baseUrl = 'http://acm.hdu.edu.cn/statistic.php?pid=';

      for (var i = 1000; i < 1010; i++) {
        var tmp =  baseUrl + i;
        urls.push(tmp);
      }

      return urls;
    }

接着我们用 async 进行异步爬取：

    app.get('/', function (req, res, next) {
      var urls = getUrls();
      
      // 并发量控制为 5 
      async.mapLimit(urls, 5, function (url, callback) {
        fetchUrl(url, callback);
      }, function (err, result) {
        res.send(result);
      });

    });


我们再来看 fetchUrl 函数：

	// 抓取网页内容
	function fetchUrl(url, callback) {
	  superagent.get(url)
	    .end(function (err, res) {      
	      var page = res.text;
	
	      // 页面分析，返回需要的数据
	      var postTime = analyze(page);
	
	      callback(null, postTime);
	    });
	}

这里要注意的是 callback 中的第二个参数，其实 postTime 已经储存在了 mapLimit 方法第四个参数的 result 参数中。当然，你完全可以自定义变量来保存数据。

代码比较简单，完整代码可以猛戳 [这里](https://github.com/hanzichi/practice/blob/master/node/%E5%A4%9A%E9%A1%B5%E9%9D%A2%E6%8A%93%E5%8F%96%EF%BC%88%E6%8E%A7%E5%88%B6%E5%B9%B6%E5%8F%91%E9%87%8F%EF%BC%89/index.js)。

还有个问题是，什么时候用 eventproxy，什么时候使用 async 呢？它们不都是用来做异步流程控制的吗？

alsotang 的答案是：

> 当你需要去多个源(一般是小于 10 个)汇总数据的时候，用 eventproxy 方便；当你需要用到队列，需要控制并发数，或者你喜欢函数式编程思维时，使用 async。大部分场景是前者，所以我个人大部分时间是用 eventproxy 的。

经过测试，并发量确实为 5。具体测试方法，定义一个全局（global）变量 num，初始化为 0。当其进入 fetchUrl 函数时，num 自加，同时打印此时并发的数量，在 superagent 的 end 回调中，num 自减，因为此时该并发已经结束。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160111193509741-487102479.png)
### 本文目标 ###
***

本文的目标是获取 [ZOJ](http://acm.zju.edu.cn/onlinejudge/showProblemsets.do)  1001-1010 **每道题 best solution 的作者 id**，取得数据后**一次性输出**在控制台。

前文 [如何用 Nodejs 分析一个简单页面](http://www.cnblogs.com/zichi/p/4896819.html) 我们讲了如何用 Nodejs 简单地对一个页面进行分析，我们再来理一理，温故而知新。首先，我们的目标是能输出在页面上，这时我们就需要 `http` 模块，或者封装了 `http` 模块的 `express` 模块。其次我们需要获取博客园首页的页面代码，就要发送 http 请求，而 `superagent` 模块正是我们所需要的。最后我们要对获取的页面代码进行分析，`cheerio` 模块能让我们用类似 jQuery 的语法对页面进行解析，何止一个爽字了得！


### 实践 ###
***

再看今天我们的任务，粗看之下，少了输出在页面这个条件（不需要用 http 甚至 express 模块了），而需要输出每道题的 best solution 的作者 id，似乎并不是很难，我们来分析下 1001 这道题的[提交统计页面](http://acm.zju.edu.cn/onlinejudge/showProblemStatus.do?problemId=2)，很显然第一条就是最佳 solution 嘛，我们像前面一样用 `SuperAgent` 模块请求该页面，然后用 `cheerio` 模块进行解析，不就大功告成了？！什么，要解析 10 个页面？那就发送 10 次 http 请求喽！

我们再来看下这个页面的 url <http://acm.zju.edu.cn/onlinejudge/showProblemStatus.do?problemId=1>，简直不能太爽有木有，那么 1002 题就是 `problemId=2` 吧，以此类推。

我们很快写下了如下代码：

    var cheerio = require('cheerio');
    var superagent = require('superagent');

    var urls = [];
    for (var i = 1; i <= 10; i++) {
      var tmp = 'http://acm.zju.edu.cn/onlinejudge/showProblemStatus.do?problemId=' + i;
      urls.push(tmp);
    }

    urls.forEach(function(item) {
      superagent
      .get(item)
      .end(function (err, sres) { // callback
        if (err) {
          console.error(err);
        }

        var $ = cheerio.load(sres.text);
        var ans = $('.runUserName a font').eq(0).text();
        console.log(ans);
      });
    });


控制台输出了我们想要的 10 个 id 有木有！可是...这跟前面学的好像并没有什么区别，无非是多做了 几次请求？我们再来看下本文目标，**一次性**输出有没有！再看上面代码的执行，很显然是一个一个输出，所以有时候审题真的很重要。那么，我们定义一个数组，然后把每次的结果存入数组，最后再将数组输出，不就行了？可是会输出一个空数组，是啊，`superagent` 是异步执行的啊亲！


### eventproxy 模块###
***

这种事情，早就有人想到了，`eventproxy` 模块就可以完美解决这个问题。我们想想如果自己写该怎么做？

SuperAgent 其实可以看做是服务端的 ajax，如果我们要在客户端完成 2 次 ajax操作，然后将返回的信息一起输出，会怎么做？

可能会这么写：
	
	// jQuery
    $.get(url1, function(data1) {
      $.get(url2, function(data2) {
        var ans = gao(data1, data2);
        console.log(ans);
      })
    });

但是如果是 10 次请求呢？那就要嵌套 10 个回调了，太乱了。而且这样写效率太低，跟同步获取是一样一样的，果断 pass！

通常的做法是维护一个计数器，每次异步处理完后，将该计数器自加一，如果累计到了一个特定的数值（比如 2 次请求那么就是 2），就触发事件处理。

    var count = 0
      , datas = [];

    function gao() {
      if (count !== 2)
        return;

      // ...
    }

    // jQuery
    $.get(url1, function(data) {
      datas.push(data);
      count++;
      gao();
    });

    $.get(url2, function(data) {
      datas.push(data);
      count++;
      gao();
    });


但是这样写，总觉得不够优雅，最后我们来学习下使用 `eventproxy` 模块后的写法。eventproxy 实际上就起到了计数器的作用，它来帮你管理到底这些异步操作是否完成，完成之后，它会自动调用你提供的处理函数，并将抓取到的数据当参数传过来。

    var ep = new eventproxy();

    ep.all('data1_event', 'data2_event', function (data1, data2) {
      var ans = gao(data1, data2,);
      console.log(ans);
    });

    $.get(url1, function (data) {
      ep.emit('data1_event', data);
    });

    $.get(url2, function (data) {
      ep.emit('data2_event', data);
    });


ep.all() 监听了两个事件，data1_event 以及 data2_event，每次当一个数据源抓取完成后，就通过 ep.emit() 告诉 ep 自己，我的抓取已经完成了，相当于维护了一个计数器。当 2 件事件都完成时，就会调用 ep.all() 的回调函数对数据进行处理。

eventproxy 提供了不少其他场景所需的 API，但最最常用的用法就是以上的这种，即：

1. 先 var ep = new eventproxy(); 得到一个 eventproxy 实例。
2. 告诉它你要监听哪些事件，并给它一个回调函数。ep.all('event1', 'event2', function (result1, result2) {})。
3. 在适当的时候 ep.emit('event_name', eventData)。

如果是重复执行多次，比如读取10个文件，调用5次数据库等，可以用到它的 `after` 方法，api 可以参考[重复异步协作](https://github.com/JacksonTian/eventproxy#%E9%87%8D%E5%A4%8D%E5%BC%82%E6%AD%A5%E5%8D%8F%E4%BD%9C)，直接看代码：
   
    // 得到一个 eventproxy 的实例
    var ep = new eventproxy();

    // 命令 ep 重复监听 urls.length 次（在这里也就是 10 次） `topic_html` 事件再行动
    ep.after('topic_html', urls.length, function (topics) {
      // topics 是个数组，包含了 10 次 ep.emit('topic_html', page) 中的那 10 个 page
      // 开始行动
      topics = topics.map(function(page) {
        // 接下来都是 jquery 的用法了
        var $ = cheerio.load(page);
        var userId = $('.runUserName a font').eq(0).text();
        return userId;
      });

      console.log(topics);
    });

    urls.forEach(function(item) {
      superagent.get(item)
        .end(function (err, res) {
          ep.emit('topic_html', res.text);
        });
    });

其实 emit() 和 after() 可以这样想象，一个负责抛出事件，一个负责监听事件（当然是先监听后抛出），余下的也就不难理解了。关于 eventproxy 更多可以参考 [JacksonTian/eventproxy](https://github.com/JacksonTian/eventproxy)


### 总结 ###
***

今天介绍的 `eventproxy` 模块是控制并发用的，有时我们需要同时发送 N 个 http 请求，然后利用得到的数据进行后期的处理工作，如何方便地判断数据已经全部并发获取得到，就可以用到该模块了。而模块不仅可以在服务端使用，也可以应用在客户端，详细可以参考[JacksonTian/eventproxy](https://github.com/JacksonTian/eventproxy)

参考：[《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)
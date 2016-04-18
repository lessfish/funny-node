### 本文目的 ###
***

在浏览器地址栏中输入 `localhost:3000`，在页面显示 [博客园首页](http://www.cnblogs.com/) 的 20 篇文章标题。


### 过程分析 ###
***

首先需要端口的监听，这就需要引入 Node 中最重要的模块之一 `express`。其次需要对 <http://www.cnblogs.com/> 页面发送类似 http 的请求以获取页面数据进行分析，这里需要引入 `SuperAgent` 模块。最后为了能使请求得到的 html 源码进行类似 dom 一般的操作，需要引入 `cheerio` 模块。


### express 模块 ###
***

首先第一步，我们要实现端口的监听，以便能将信息输出到页面上。

我们可以用 `http` 模块：

    var http = require("http");
    http.createServer(function(request, response) {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("Hello World!");
      response.end();
    }).listen(3000);

当然我们更可以用封装了 `http` 功能更加强大的 [express](http://expressjs.com/) 模块：

    // 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
    var express = require('express');
    // 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
    var app = express();

    // app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
    // 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
    // request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
    // res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
    app.get('/', function (req, res) {
      res.send('Hello World');
    });

    // 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
    app.listen(3000, function () {
      console.log('app is listening at port 3000');
    });


### SuperAgent 模块 ###
***

接着我们需要获取博客园首页的代码从而能进行分析。[SuperAgent](http://visionmedia.github.io/superagent/) 就是服务端可以发送 get post 等 http 请求的模块，直接看代码，更多的 api 可以参考文档。

    var express = require('express');
    var superagent = require('superagent');

    var app = express();

    app.get('/', function (req, res, next) {
      superagent
        .get('http://www.cnblogs.com/')
        .end(function (err, ans) {
          // 常规的错误处理
          if (err) {
            return next(err);
          }

          res.send(ans.text);
        });
    });


    app.listen(3000, function () {
      console.log('app is listening at port 3000');
    });


### cheerio 模块 ###
***

我们用 SuperAgent 模块获取了博客园的页面代码，而用 cheerio 则可以进行类似 Jquery 的 css 选择器操作。cheerio 模块的详细 api 可以参考 [文档](https://github.com/cheeriojs/cheerio)。


### 完整代码 ###
***

    var express = require('express');
    var cheerio = require('cheerio');
    var superagent = require('superagent');

    var app = express();

    app.get('/', function (req, res, next) {
      superagent
        .get('http://www.cnblogs.com/')
        .end(function (err, sres) { // callback
          // 常规的错误处理
          if (err) {
            return next(err);
          }

          // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
          // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
          // 剩下就都是 jquery 的内容了
          var $ = cheerio.load(sres.text);
          var ans = '';
          $('.titlelnk').each(function (index, item) {
            var $item = $(item);
            ans += $item.html() + '<br/><br/>';
          });

          // 将内容呈现到页面
          res.send(ans);
        });
    });

    app.listen(3000, function () {
      console.log('app is listening at port 3000');
    });


这时启动 `localhost:3000`，页面就能显示博客园首页的 20 篇文章标题啦（虽然没样式不太美观）！（当然得先 node fileName.js)


当然我们也可以直接把内容输出在控制台：

    var cheerio = require('cheerio');
    var superagent = require('superagent');

    superagent
      .get('http://www.cnblogs.com/')
      .end(function (err, sres) { // callback
        // 常规的错误处理
        if (err) {
          console.error(err);
        }

        // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是 jquery 的内容了
        var $ = cheerio.load(sres.text);
        $('.titlelnk').each(function (index, item) {
          var $item = $(item);
          console.log($item.text());
        });
      });


参考：[《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)
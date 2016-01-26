// 抓取博客园首页 20 篇文章标题
// url：localhost:3000
// reference：http://www.cnblogs.com/zichi/p/4896819.html

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
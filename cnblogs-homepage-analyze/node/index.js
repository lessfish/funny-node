var express = require('express')
  , cheerio = require('cheerio')
  , superagent = require('superagent')
  , eventproxy = require('eventproxy');

// 得到一个 eventproxy 的实例
var ep = new eventproxy()
  , app = express();


app.get('/', function (req, res, next) {
  var postUrl = 'http://www.cnblogs.com/mvc/AggSite/PostList.aspx'
    // 共有 200 页文章
    // 从第 51 页开始抓取
    , startNum = 51
    // 抓取的网页数量
    , pageNum = 150;

  // 监听 pageNum 次 `curl` 事件后，执行回调
  ep.after('curl', pageNum, function (data) {
    // data 是个数组，包含了 pageNum 次 ep.emit('curl', tmp) 中的那 pageNum 个 tmp

    var ans = [];
    for (var i = 0, len = data.length; i < len; i++)
      Array.prototype.push.apply(ans, data[i]);

    // 返回 jsonp 供前端调用，callback 函数名为 fn
    res.send("fn(" + JSON.stringify(ans) + ");");
  });

  // 从第 51 页开始抓取
  for (var i = startNum; i < startNum + pageNum; i++) {
    superagent
      .post(postUrl)
      .send({"CategoryType":"SiteHome","ParentCategoryId":0,"CategoryId":808,"PageIndex":i,"ItemListActionName":"PostList"})
      .end(function (err, sres) { // callback
        // 常规的错误处理
        if (err) {
          return next(err);
        }

        // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jQuery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是 jQuery 的内容了
        var $ = cheerio.load(sres.text);
        // 存储每页 20 条数据的 20 个对象
        var tmp = [];

        // 获取博文发表时间
        $('.lightblue').each(function (index, item) {
          var str = item.nextSibling.nodeValue
            , pos = str.indexOf(":")
            , obj = {postHour: str.substring(pos - 2, pos)};

          tmp.push(obj);
        });

        // 获取博文阅读量
        $('.article_view .gray').each(function (index, item) {
          var $item = $(item)
            , str = $item.html();

          var start = str.indexOf('(')
            , end = str.indexOf(')');

          tmp[index].viewTimes = str.substring(start + 1, end);
        });

        // 每抓取一个网页，抛出事件
        ep.emit('curl', tmp.concat());
      });
  }
});

// listen
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
const cheerio = require('cheerio')
  , superagent = require('superagent')
  , eventproxy = require('eventproxy')

// 需要爬的网址
function getUrls() {
  var urls = []
    , baseUrl = 'http://acm.hdu.edu.cn/statistic.php?pid=';

  for (var i = 1000; i <= 1009; i++) {
    var tmp =  baseUrl + i;
    urls.push(tmp);
  }

  return urls;
}

// 页面解析，返回需要的内容
function analyze(html) {
  var $ = cheerio.load(html);
  var userId = $('.table_text td').eq(6).html();

  return userId;
}

// 抓取网页内容
function fetchUrl(url) {
  superagent.get(url)
    .end(function (err, res) {
      // 抛出 `curl` 事件
      ep.emit('curl', res.text);
    });
}


// start
var urls = getUrls();

// 得到一个 eventproxy 的实例
var ep = new eventproxy();

// ep 重复监听 `curl` 事件 urls.length 次（在这里也就是 10 次）后
// 执行回调函数
ep.after('curl', urls.length, function (htmls) {
  // pages 是个数组，包含了 10 次 ep.emit('curl', page) 中的那 10 个 page
  var res = htmls.map(function(html) {
    // 接下来都是 jQuery 的用法了
    return analyze(html);
  });

  // 结果呈现
  console.log(res)
});

// 开始并发爬取
urls.forEach(function(item) {
  fetchUrl(item);
});
var cheerio = require('cheerio')
  , superagent = require('superagent')
  , async = require('async');

// 需要爬的网址
function getUrls() {
  var urls = []
    , baseUrl = 'http://acm.hdu.edu.cn/statistic.php?pid=';

  for (var i = 1000; i < 1100; i++) {
    var tmp =  baseUrl + i;
    urls.push(tmp);
  }

  return urls;
}

// 页面解析，返回需要的内容
function analyze(page) {
  var $ = cheerio.load(page);
  var postTime = $('.table_text td').eq(6).html();

  return postTime;
}

// 抓取网页内容
function fetchUrl(url, callback) {
  superagent.get(url)
    .end(function (err, res) {
      var page = res.text;

      // 页面分析，返回需要的数据
      var postTime = analyze(page);

      // postTime 加入到了 result 数组中
      callback(null, postTime);
    });
}


var urls = getUrls();

// 并发量控制为 5
// 对每个元素执行第三个回调
// 全部执行完后执行第四个回调
async.mapLimit(urls, 5, function(url, callback) {
  fetchUrl(url, callback);
}, function (err, result) {
  console.log(result)
});
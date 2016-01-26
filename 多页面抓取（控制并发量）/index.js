// 多页面抓取
// async 模块控制并发量


var cheerio = require('cheerio')
  , superagent = require('superagent')
  , eventproxy = require('eventproxy')
  , express = require('express')
  , async = require('async');


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

      callback(null, postTime);
    });
}



// start
var app = express();

app.get('/', function (req, res, next) {
  var urls = getUrls();

  // 并发量控制为 5 
  async.mapLimit(urls, 5, function (url, callback) {
    fetchUrl(url, callback);
  }, function (err, result) {
    res.send(result);
  });
});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
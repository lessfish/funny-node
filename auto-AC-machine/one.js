var cheerio = require('cheerio')
  , superagent = require('superagent')
  , globalCookie = undefined;


// 模拟代码提交
function post(code, problemId) {
  superagent
    // 代码 post 的 url
    .post('http://acm.hdu.edu.cn/submit.php?action=submit')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set("Cookie", globalCookie)
    .send({"problemid": problemId})
    .send({"usercode": code})
    .end(function (err, sres) {
    });
}


// 从 csdn 题解详情页获取代码
function getCode(solutionUrl, problemId) {
  superagent.get(solutionUrl, function(err, sres) {
    // 为防止该 solutionUrl 可能不是题解详情页
    // 如果不是，则没有 class 为 cpp 的 dom 元素
    try {
      var $ = cheerio.load(sres.text);
      var code = $('.cpp').eq(0).text();

      if (!code)
        return;

      post(code, problemId);
    } catch(e) {

    }
  });
}


// 模拟百度搜索题解
function bdSearch(problemId) {
  var searchUrl = 'https://www.baidu.com/s?ie=UTF-8&wd=hdu' + problemId;

  superagent
    .get(searchUrl)
    // 必带的请求头 UA
    .set("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36")
    .end(function(err, sres) {
      var $ = cheerio.load(sres.text);
      var lis = $('.t a');

      for (var i = 0; i < 10; i++) {
        var node = lis.eq(i);

        // 获取那个小的 url 地址
        var text = node.parent().next().next().children("a").text();

        // 如果 url 不带有 csdn 字样，则返回
        // 只分析 csdn 题解
        if (text.toLowerCase().indexOf("csdn") === -1)
          continue;

        // 题解详情页 url
        var solutionUrl = node.attr('href');
        getCode(solutionUrl, problemId);
      }
    });
}


// 模拟登录
function login() {
  superagent
    // get 请求任意 acm.hdu.edu.cn 域名下的一个 url
    // 获取 key 为 PHPSESSID 这个 Cookie
    .get('http://acm.hdu.edu.cn/status.php')
    .end(function(err, sres) {
      // 提取 Cookie
      var str = sres.header['set-cookie'][0];
      // 过滤响应头 Cookie 中的 path 字段
      var pos = str.indexOf(';');
      // 全局变量存储 Cookie，post 代码提交时候用
      globalCookie = str.substr(0, pos);

      // 模拟登录
      superagent
        // 登录 url
        .post('http://acm.hdu.edu.cn/userloginex.php?action=login')
        // post 用户名 & 密码
        .send({"username": "hanzichi"})
        .send({"userpass": "hanzichi"})
        // 这个请求头是必须的
        .set("Content-Type", "application/x-www-form-urlencoded")
        // 请求携带 Cookie
        .set("Cookie", globalCookie)
        .end(function(err, sres) {
          // 登录完成后，启动程序
          start();
        });
    });
}

// 模拟提交 hdoj 1004
function start() {
  bdSearch(1004);
}

login();
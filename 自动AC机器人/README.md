#前言

不说话，先猛戳 [Ranklist](http://acm.hdu.edu.cn/ranklist.php) 看我排名。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205041177-1853385669.png)

这是用 node 自动刷题大概半天的 "战绩"，本文就来为大家简单讲解下如何用 node 做一个 "自动AC机"。


#过程

先来扯扯 oj（online judge）。计算机学院的同学应该对 ACM 都不会陌生，ACM 竞赛是拼算法以及数据结构的比赛，而 oj 正是练习 ACM 的 "场地"。国内比较有名的 oj 有 poj、zoj 以及 hdoj 等等，这里我选了 [hdoj](http://acm.hdu.edu.cn/) （完全是因为本地上 hdoj 网速快）。

在 oj 做题非常简单。以 hdoj 为例，先注册个账号（<http://bestcoder.hdu.edu.cn/register.php>），然后随便打开一道题（<http://acm.hdu.edu.cn/showproblem.php?pid=1000>），点击最下面的 Submit 按钮（<http://acm.hdu.edu.cn/submit.php?pid=1000>），选择提交语言（Language），将答案复制进去，最后再点击 Submit 按钮提交，之后就可以去查看是否 AC（Accepted） 了（<http://acm.hdu.edu.cn/status.php>）。

用 node 来模拟用户的这个过程，其实就是一个 **模拟登录+模拟提交** 的过程，根据经验，模拟提交这个 post 过程肯定会带有 cookie。提交的 code 哪里来呢？直接爬取搜索引擎就好了。

整个思路非常清晰：

1. 模拟登录（post）
2. 从搜索引擎爬取 code（get）
3. 模拟提交（post）


#模拟登录

首先来看模拟登录，根据经验，这大概是一个 post 过程，会将用户名以及密码以 post 的方式传给服务器。打开 chrome，F12，抓下这个包，有必要时可以将 `Preserve log` 这个选项勾上。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205256130-1261007766.jpg)

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205303474-1508925128.jpg)

请求头居然还带有 Cookie，经测试，key 为 `PHPSESSID` 的这个 Cookie 是请求所必须的，这个 Cookie 哪来的呢？其实你只要一打开 `http://acm.hdu.edu.cn/` 域名下的任意地址，服务端便会把这个 Cookie "种" 在浏览器中。一般你登录总得先打开登录页面吧？打开后自然就有这个 Cookie 了，而登录请求便会携带这个 Cookie。一旦请求成功，服务器便会和客户端建立一个 session，服务端表示这个 cookie 我认识了，每次带着这个 cookie 请求的我都可以通过了。一旦用户退出，那么该 session 中止，服务端把该 cookie 从认识名单中删除，即使再次带着该 cookie 提交，服务端也会表示 "不认识你了"。

所以模拟登录可以分为两个过程，首先请求 `http://acm.hdu.edu.cn/` 域名下的任意一个地址，并且将返回头中 key 为 `PHPSESSID` 的 Cookie 取出来保存（key=value 形式），然后携带 Cookie 进行 post 请求进行登录。

    // 模拟登录
    function login() {
      superagent
        // get 请求任意 acm.hdu.edu.cn 域名下的一个 url
        // 获取 key 为 PHPSESSID 这个 Cookie
        .get('http://acm.hdu.edu.cn/status.php')
        .end(function(err, sres) {
          // 提取 Cookie
          var str = sres.header['set-cookie'][0];
          // 过滤 path
          var pos = str.indexOf(';');

          // 全局变量存储 Cookie，登录 以及 post 代码时候用
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

模拟 HTTP 请求的时候，有些请求头是必须的，有些则是可以忽略。比如模拟登录 post 时，`Content-Type` 这个请求头是必须携带的，找了我好久，如果程序一直启动不了，可以试试把所有请求头都带上，逐个进行排查。


#搜索引擎爬取 Code

这一部分我做的比较粗糙，这也是我的爬虫 AC 正确率比较低下的原因。

我选择了百度来爬取答案。以 hdu1004 这道题为例，如果要搜索该题的 AC 代码，我们一般会在百度搜索框中输入 *hdu1004*，而结果展现的页面 url 为 <https://www.baidu.com/s?ie=UTF-8&wd=hdu1004>。这个 url 还是非常有规律的，https://www.baidu.com/s?ie=UTF-8&wd= 加上 keyword。

百度的一个页面会展现 10 个搜索结果，代码里我选择了 ACMer 在 csdn 里的题解，因为 csdn 里的代码块真是太好找了，不信请看。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205357474-452359106.jpg)

csdn 把代码完全放在了一个 class 为 cpp 的 dom 元素中，简直是太友好了有没有！相比之下，博客园等其他地方还要字符串过滤，为了简单省事，就直接选取了 csdn 的题解代码。

一开始我以为，一个搜索结果页有十条结果，每条结果很显然都有一个详情页的 url，判断一下 url 中有没有 csdn 的字样，如果有，则进入详情页去抓 code。但是百度居然给这个 url 加密了！

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205434880-1377990420.jpg)

我注意到每个搜索结果还带有一个小字样的 url，没有加密，见下图。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131210708255-1354226738.jpg)

于是我决定分析这个 url，如果带有 csdn 字样，则跳转到该搜索结果的详情页进行代码抓取。事实上，带有 csdn 的也不一定能抓到 code（ csdn 的其他二级域名，比如下载频道 <http://download.csdn.net/>），所以在 getCode() 函数中写了个 try{}..catch(){} 以免代码出错。

    // 模拟百度搜索题解
    function bdSearch(problemId) {
      var searchUrl = 'https://www.baidu.com/s?ie=UTF-8&wd=hdu' + problemId;
      // 模拟百度搜索
      superagent
        .get(searchUrl)
        // 必带的请求头
        .set("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36")
        .end(function(err, sres) {
          var $ = cheerio.load(sres.text);
          var lis = $('.t a');
          for (var i = 0; i < 10; i++) {
            var node = lis.eq(i);

            // 获取那个小的 url 地址
            var text = node.parent().next().next().children("a").text();

            // 如果 url 不带有 csdn 字样，则返回
            if (text.toLowerCase().indexOf("csdn") === -1)
              continue;

            // 题解详情页 url
            var solutionUrl = node.attr('href');
            getCode(solutionUrl, problemId);
          }
        });
    }


bdSearch() 函数传入一个参数，为 hdoj 题目编号。然后去爬取百度获取题解详情页的 url，经过测试 **爬取百度必须带有 UA**！其他的就非常简单了，代码里的注释很清楚。

    // 从 csdn 题解详情页获取代码
    function getCode(solutionUrl, problemId) {

      superagent.get(solutionUrl, function(err, sres) {
        // 为防止该 solutionUrl 可能不是题解详情页
        // 没有 class 为 cpp 的 dom 元素
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

getCode() 函数根据题解详情页获取代码。前面说了，csdn 的代码块非常直接，都在一个类名为 cpp 的 dom 元素中。


#模拟提交

最后一步来看模拟提交。我们可以抓一下这个 post 包看看长啥样。

![](http://images2015.cnblogs.com/blog/675542/201601/675542-20160131205517958-729450520.jpg)

很显然，Cookie 是必须的，我们在第一步模拟登录的时候已经得到这个 Cookie 了。因为这是一个 form 表单的提交，所以 Content-Type 这个请求 key 也需要携带。其他的话，就在请求数据中了，problemid 很显然是题号，code 很显然就是上面求得的代码。

    // 模拟代码提交
    function post(code, problemId) {
      superagent
        .post('http://acm.hdu.edu.cn/submit.php?action=submit')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set("Cookie", globalCookie)
        .send({"problemid": problemId})
        .send({"usercode": code})
        .end(function (err, sres) {
        });
    }


#完整代码

完整代码可以参考 [Github](https://github.com/hanzichi/funny-node/tree/master/%E8%87%AA%E5%8A%A8AC%E6%9C%BA%E5%99%A8%E4%BA%BA)。

其中 [singleSubmit.js](https://github.com/hanzichi/funny-node/blob/master/%E8%87%AA%E5%8A%A8AC%E6%9C%BA%E5%99%A8%E4%BA%BA/singleSubmit.js) 为单一题目提交，实例代码为 hdu1004 的提交，而 [allSubmit.js](https://github.com/hanzichi/funny-node/blob/master/%E8%87%AA%E5%8A%A8AC%E6%9C%BA%E5%99%A8%E4%BA%BA/allSubmit.js) 为所有代码的提交，代码中我设置了一个 10s 的延迟，即每 10s 去百度搜索一次题解，因为要爬取 baidu、csdn 以及 hdoj 三个网站，任意一个网站 ip 被封都会停止整个灌水机的运作，所以压力还是很大的，设置个 10s 的延迟后应该木有什么问题了。

学习 node 主要就是因为对爬虫有兴趣，也陆陆续续完成了几次简单的爬取，可以移步我的博客中的 [Node.js 系列](http://www.cnblogs.com/zichi/category/708864.html)。这之前我把代码都随手扔在了 Github 中，居然有人 star 和 fork，让我受宠若惊，决定给我的爬虫项目单独建个新的目录，记录学习 node 的过程，项目地址 <https://github.com/hanzichi/funny-node>。我会把我的 node 爬虫代码都同步在这里，同时会记录每次爬虫的实现过程，保存为每个小目录的 README.md 文件。


#后续优化

仔细看，其实我的爬虫非常 "智弱"，正确率十分低下，甚至不能 AC hdu1001！我认为可以从以下几个方面进行后续改进：

- 爬取 csdn 题解详情页时进行 title 过滤。比如爬取 hdu5300 的题解 <https://www.baidu.com/s?ie=UTF-8&wd=hdu5300>，搜索结果中有 HDU4389，程序显然没有预料到这一点，而会将之代码提交，显然会 WA 掉。而如果在详情页中进行 title 过滤的话，能有效避免这一点，因为 ACMer 写题解时，title 一般都会带 hdu5300 或者 hdoj5300 字样。

- 爬取具体网站。爬取百度显然不是明智之举，我的实际 AC 正确率在 50% 左右，我尼玛，难道题解上的代码一半都是错误的吗？可能某些提交选错了语言（post 时有个 language 参数，默认为 0 为 G++提交，程序都是以 G++ 进行提交），其实我们并不能判断百度搜索得到的题解代码是否真的正确。如何提高正确率？我们可以定向爬取一些题解网站，比如 <http://accepted.com.cn/> 或者 <http://www.acmerblog.com/>，甚至可以爬取 <http://acm.hust.edu.cn/vjudge/problem/status.action> 中 AC 的代码！

- 实时获取提交结果。我的代码写的比较粗糙，爬取百度搜索第一页的 csdn 题解代码，如果有 10 个就提交 10 个，如果没有那就不提交。一个更好的策略是实时获取提交结果，比如先提交第一个，获取返回结果，如果 WA 了则继续提交，如果 AC 了那就 break 掉。获取提交结果的话，暂时没有找到这个返回接口，可以从 <http://acm.hdu.edu.cn/status.php> 中进行判断，也可以抓取 user 详情页 <http://acm.hdu.edu.cn/userstatus.php?user=hanzichi>。

**PS：我在 hdoj 的账号用户名和密码均为 hanzichi，有兴趣的可以用我的账号继续刷题。**

#其他

其实 hdoj 排行榜第一页有不少都是机器人刷的。

比如 [NKspider](http://acm.hdu.edu.cn/userstatus.php?user=NKspider) 这位仁兄，他是用 C++ 写的，具体可以参考 <http://blog.csdn.net/nk_test/article/details/49497017>。

再比如 [beautifulzzzz](http://acm.hdu.edu.cn/userstatus.php?user=beautifulzzzz1) 这位哥们，是用 C# 刷的，具体可以参考 <http://www.cnblogs.com/zjutlitao/p/4337775.html>。

同样用 C# 刷的还有 [CSUSTrobot](http://acm.hdu.edu.cn/userstatus.php?user=CSUSTrobot)，过程可以参考 <http://blog.csdn.net/qwb492859377/article/details/47448599>。

思路都是类似的，它们的代码都不短，node 才百来行就能搞定，实在是太强大了！
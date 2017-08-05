分别尝试用 [superagent](/proxy/superagent-proxy.js) 以及 [request](/proxy/request-proxy.js) 来做 ip 代理的 HTTP 请求库。

使用方法非常简单，首先通过不同渠道获取一些免费 ip，然后通过相应 api 去模拟请求。

一些免费 ip 库：

- http://www.xicidaili.com/nn
- http://www.66ip.cn/
- http://cn-proxy.com/
- http://www.kuaidaili.com/free/
- http://ip.chinaz.com/getip.aspx（验证代理是否可用）

[这里](https://segmentfault.com/q/1010000008196143/a-1020000008200295) 有一个很好的帖子给了我思路，首先获取免费 ip，然后去请求 http://ip.chinaz.com/getip.aspx ，因为这个网站本身就是通过 ip 来验证归属地的，通过请求的结果就能判断 ip 是否可用，适当设置 timeout 参数。

---

todo:

proxies 在你访问 http 时用 http 的设置，访问 https 时用 https 的设置。原代码中只考虑了 http 的情况，todo

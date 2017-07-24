const request = require('request')
const iconv = require('iconv-lite')
const superagent = require('superagent')
require('superagent-proxy')(superagent)


// 获取代理 ip
function getProxyList() {
  // 一个免费 ip 库
  var apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';

  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: apiURL,
      gzip: true,
      encoding: null,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'referer': 'http://www.66ip.cn/'
      },
    };

    request(options, function (error, response, body) {
      try {
        if (error) 
          throw error;

        if (/meta.*charset=gb2312/.test(body)) {
          body = iconv.decode(body, 'gbk');
        }

        var ret = body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);
        resolve(ret);
      } catch (e) {
        return reject(e);
      }
    });
  })
}


// 遍历 ip，找到一个能用的就停止
getProxyList().then(function (proxyList) {
  let getPage = index => {
    let proxy =  'http://' + proxyList[index]; // 设置代理

    superagent
      .get('http://zichi.date') // 请求网页源码来测试 proxy
      .proxy(proxy) // key code
      .timeout(8000)
      .end((err, res) => {
        if (err) {
          console.log(err)
          getPage(index + 1)
          return;
        }

        console.log(res.text);
      })
  }

  getPage(0)
}).catch(e => {
  console.log(e);
})
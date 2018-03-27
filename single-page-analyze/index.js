const cheerio = require('cheerio')
const superagent = require('superagent')

let url = 'http://www.cnblogs.com/'
superagent
  .get(url)
  .end(function(err, sres) { // callback
    // 常规的错误处理
    if (err) {
      return next(err)
    }

    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jQuery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jQuery 的内容了
    let $ = cheerio.load(sres.text)
    let ans = []

    $('.titlelnk').each(function(index, item) {
      let $item = $(item)
      
      // 如果用 $item.html() 会得到 HTML 实体编码
      ans.push($item.text())
    })

    console.log(ans)
  })
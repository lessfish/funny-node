const superagent = require('superagent')
const querystring = require('querystring')
const async = require('async')
const connection = require('./model').connection
const insertData = require('./model').insertData

// 连接数据库
connection.connect()

// 爬取的数据总数
var total = 0

var q = async.queue(function(task, callback) {
  // callback 运行的时候是这个任务结束的标志，所以如果有异步操作，callback 需要在异步的回调函数中去执行
  task.run(callback)
}, 5) // 控制 5 个并发量

// q.saturated = function() {
//   console.log('all workers to be used');
// }

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
q.drain = function() {
  console.log('all tasks have been processed!');
  // connection.end();
  console.log(total)
}

let baseUrl = 'http://api.map.baidu.com/place/v2/search?\
tag=' + querystring.escape('公司企业') +
'&query=' + querystring.escape('信息$电信$数据$电子商务$互联网$网络') +
'&output=json\
&ak=TyyWGrjACoSWpsc7SAuupG7Z0156DADe\
&page_size=20'


function getDataInfo(url) {
  return new Promise(resolve => {
    superagent
      .get(url)
      .end(function(err, sres) { 
        if (err) {
          console.log('出错了')
        } else {
          resolve(JSON.parse(sres.text))
        }
      })
  })
}

function getAllData(bottomLeft, topRight) {
  for (let i = 0; i <= 19; i++) {
    q.push({
      run: function(cb) {
        ;(async function() {
          let url = baseUrl + '&bounds=' + bottomLeft[0] + ',' + bottomLeft[1] + ',' + topRight[0] + ',' + topRight[1] + '&page_num=' + i 
          
          let ret = await getDataInfo(url)
          cb()
          
          if (Array.isArray(ret.results) && ret.results.length) {
            total += ret.results.length
            ret.results.forEach(item => {
              insertData(item.name, item.address, item.location.lat, item.location.lng)
            })
          }
        })()
      }
    }, () => {console.log('完成抓取')})
  }
}

function dfs(bottomLeft, topRight) {
  q.push({
    run: function(cb) {
      ;(async function() {
        let url = baseUrl + '&bounds=' + bottomLeft[0] + ',' + bottomLeft[1] + ',' + topRight[0] + ',' + topRight[1]
        
        let ret = await getDataInfo(url)
        cb()

        // 还可以继续递归
        if (ret.total === 400) {
          console.log('net yet...')
          // 分割
          let midX = (bottomLeft[0] + topRight[0]) / 2
          let midY = (bottomLeft[1] + topRight[1]) / 2
          
          dfs([midX, bottomLeft[1]], [topRight[0], midY])
          dfs([midX, midY], topRight)
          dfs(bottomLeft, [midX, midY])
          dfs([bottomLeft[0], midY], [midX, topRight[1]])
        } else { // 已经是小区块
          getAllData(bottomLeft, topRight)
          console.log('抓取小区块数据')
        }
      })()
    }
  }, () => {console.log('完成抓取')}) 
}

// 开始采集数据
// dfs([29.840924, 119.662545], [30.582335, 120.758016])
// 左下角坐标 & 右上角坐标
dfs([30.105725,120.09363,], [30.255579,120.410983])

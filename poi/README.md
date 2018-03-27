```bash
npm install
node index.js
```

根据百度地图 Place API 获取 POI 数据

POI，即 "Point of Interest"，中文翻译为 "兴趣点"。打开百度地图，比如搜索「酒店」，搜索结果就是 POI

本次爬虫需要获取杭州主城八区的关键词为 "信息$电信$数据$电子商务$互联网$网络" 的公司企业数据

共有两个 API 可参考，一个为根据指定区域（比如杭州）返回数据，另一个是根据（矩形）坐标返回数据。由于 Place API 有返回数据 400 条的限制，所以第一个方案 pass，只能根据坐标层层分割进行递归

首先需要获取 ak，点击 [http://lbsyun.baidu.com/apiconsole/key?application=key](这里) 进行申请，每个 api 请求都要带上 ak 参数

然后需要获取所爬取区域在百度地图坐标系上的坐标，可在 [这里](http://api.map.baidu.com/lbsapi/getpoint/index.html) 进行大概获取。然后根据 [Place API](http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi) 获取这个区域内的数据，如果数据为 400 条，即说明这个区域内的数据肯定大于 400 条，将此区域一分为四，进行递归查询，一旦所查询区域内的数据总量小于 400，则将数据入库

另外 API 请求每天有次数限制，具体可以看 [这里](http://lbsyun.baidu.com/apiconsole/quota)，2000次/天，我申请了开发者权限，可以达到 3w/天 的请求量

并发量的话，申请开发者权限后，是 3000次/分钟，因为我的爬取区域并不大，爬完都不需 3000 次请求，问题不大

并发量用 async 进行控制，我控制在 5，可自行修改。之前没申请开发者权限，也没用 async 进行控制，刚开始爬就被喊停，发短信警告了
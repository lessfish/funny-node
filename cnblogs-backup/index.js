// config
var baseFileSrc = "C:/Program Files/nodejs/cnblogs/";
var xmlSrc = "C:/Program Files/nodejs/cnblogs/CNBlogs_BlogBackup_131_201409_201608.xml";


var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');


// to download picture
function download(url, savePath) {
  var req = http.get(url, function(res){
    var binImage = '';
    res.setEncoding('binary');

    res.on('data', function(chunk){
      binImage += chunk;
    });

    res.on('end', function(){
      if (!binImage) {
        console.log('image data is null');
        return null;
      }

      fs.writeFile(savePath, binImage, 'binary', function(err){
        if (err) throw err;
        console.log('It\'s saved!'); // 文件被保存
      });
    });
  });
}

fs.readFile(xmlSrc, {encoding: "utf-8"}, function(err, data) {
  var $ = cheerio.load(data);
  $('item').each(function (index, item) {
    // 文章正文
    var content = $(item).find("description").html();
    content = content.replace("<!--[CDATA[", "").replace("]]-->", "");

    // 文章标题
    var title = $(item).find("title").text();
    // 过滤非法字符
    title = title.replace(/(\/|\\|\:|\*|\?|\"|\<|\>|\|)/g, "");

    // 日期，用来做目录索引
    // 日期格式：Sun, 24 Jul 2016 09:29:00 GMT
    var time = $(item).find("pubDate").text();

    var date = new Date(time);
    var year = date.getFullYear() + '';
    var month = date.getMonth() + '';

    var isYearFileExists = fs.existsSync(baseFileSrc + year);
    !isYearFileExists && fs.mkdirSync(baseFileSrc + year);

    var isMonthFileExists = fs.existsSync(baseFileSrc + year + "/" + month);
    !isMonthFileExists && fs.mkdirSync(baseFileSrc + year + "/" + month);

    var isDetailFileExists = fs.existsSync(baseFileSrc + year + '/' + month + '/' + title);
    !isDetailFileExists && fs.mkdirSync(baseFileSrc + year + '/' + month + '/' + title);

    // 判断是 HTML 还是 markdown
    isHTML = (content.indexOf("style") !== -1 || content.indexOf("class") !== -1)
      && content.indexOf("![]") === -1;

    if (isHTML) {
      content = '<meta charset="utf-8">' + content;

      var pattern = /src="(http.*?(jpg|gif|png))/g;
      var picId = -1;

      content = content.replace(pattern, function(a, b, c) {
        picId++;
        isPicFileExits = fs.existsSync(baseFileSrc + year + '/' + month + '/' + title + '/' + 'img');
        !isPicFileExits && fs.mkdirSync(baseFileSrc + year + '/' + month + '/' + title + '/' + 'img');

        var url = b;
        var savePath = baseFileSrc + year + '/' + month + '/' + title + '/' + 'img' + '/' + picId + '.' + c;

        download(url, savePath);

        return "src=\"img/" + picId + "." + c;
      });

      fs.writeFile(baseFileSrc + year + '/' + month + '/' + title + '/' + title + '.html', content);
    }
    else{
      var pattern = /http.*?(jpg|gif|png)/g;
      var picId = -1;

      content = content.replace(pattern, function(a, b) {
        picId++;
        isPicFileExits = fs.existsSync(baseFileSrc + year + '/' + month + '/' + title + '/' + 'img');
        !isPicFileExits && fs.mkdirSync(baseFileSrc + year + '/' + month + '/' + title + '/' + 'img');

        var url = a;
        var savePath = baseFileSrc + year + '/' + month + '/' + title + '/' + 'img' + '/' + picId + '.' + b;

        download(url, savePath);

        return "img/" + picId + "." + b;
      });

      fs.writeFile(baseFileSrc + year + '/' + month + '/' + title + '/' + title + '.md', content);
    }
  });
});
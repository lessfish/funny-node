var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

// 连接数据库
connection.connect();

// var options = ''; // sql string
// var queryOptions = '';
// var deleteOptions = '';


// 查
var query = connection.query('SELECT * from news where url = ?', ['http://www.test.com'], function(err, rows, fields) {
  if (err)
    throw err;

    // 查到的符合的条数
    console.log(rows.length);

    for (var i in rows) {
      // rows[i] 为查到的每条数据
      // ...
    }
});

// ? 为占位符

// 增
connection.query('INSERT INTO news(url, title, content) VALUES (?, ?, ?)',
  ['http://www.test.com', 'test_title', 'test_content']);


// 删
connection.query('DELETE FROM news WHERE url = (?)', ['http://www.test.com']);


// 改
connection.query('UPDATE news SET title = (?) where url = (?)',
  ['change_title', 'http://www.test.com']);


// 关闭连接
connection.end();
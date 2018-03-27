const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database : 'fish'
});

exports.connection = connection

exports.insertData = function(name, address, lat, lng) {
  connection.query('INSERT INTO poi(name, address, lat, lng) VALUES (?, ?, ?, ?)',
    [name, address, lat, lng]);
}
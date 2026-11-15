// db 연결하는 부분임
const mysql = require('mysql2');

// 본인 mysql 계정 정보로 바꿔서 쓰면 됨
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cafe_db',
  connectionLimit: 10,
});

module.exports = db;

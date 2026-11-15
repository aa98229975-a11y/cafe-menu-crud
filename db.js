// db.js - MySQL 연결 설정 (mysql2 커넥션 풀)
const path = require('path');
const mysql = require('mysql2/promise');

// .env 파일이 있으면 환경변수로 읽어온다 (Node 20.12 이상 내장 기능)
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch {
  // .env 파일이 없으면 아래 기본값을 사용한다
}

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafe_db',
};

const pool = mysql.createPool({
  ...config,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
module.exports.config = config;

// init-db.js - 데이터베이스/테이블 생성 + 기본 메뉴 데이터 입력
// 실행: npm run initdb
const mysql = require('mysql2/promise');
const { config } = require('./db');

const SEED_MENUS = [
  ['아메리카노', 2000, '커피'],
  ['카페라떼', 3000, '커피'],
  ['캐모마일', 2000, '티'],
  ['쿠키', 1000, '디저트'],
];

async function main() {
  const { database, ...serverConfig } = config;
  const conn = await mysql.createConnection({ ...serverConfig, charset: 'utf8mb4' });

  // ① 데이터베이스 생성 (이미 있으면 그대로 사용)
  try {
    await conn.query(
      'CREATE DATABASE IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
      [database]
    );
  } catch (err) {
    console.warn(`데이터베이스 생성 권한이 없어 기존 DB(${database})를 사용합니다: ${err.code}`);
  }
  await conn.query('USE ??', [database]);

  // ② menu 테이블 생성
  await conn.query(`
    CREATE TABLE IF NOT EXISTS menu (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      name     VARCHAR(50) NOT NULL,
      price    INT NOT NULL,
      category VARCHAR(20) NOT NULL
    ) DEFAULT CHARSET = utf8mb4
  `);

  // ③ 테이블이 비어 있을 때만 기본 데이터 입력
  const [[{ cnt }]] = await conn.query('SELECT COUNT(*) AS cnt FROM menu');
  if (cnt === 0) {
    await conn.query('INSERT INTO menu (name, price, category) VALUES ?', [SEED_MENUS]);
    console.log(`기본 메뉴 ${SEED_MENUS.length}개를 입력했습니다.`);
  } else {
    console.log(`menu 테이블에 이미 데이터 ${cnt}개가 있어 입력을 건너뜁니다.`);
  }

  const [rows] = await conn.query('SELECT * FROM menu ORDER BY id');
  console.table(rows);
  await conn.end();
}

main().catch((err) => {
  console.error('DB 초기화 실패:', err.code || '', err.message);
  process.exit(1);
});

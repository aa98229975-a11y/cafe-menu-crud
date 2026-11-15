-- mysql 접속해서 source로 실행하면 됨
-- mysql> source sql/cafe.sql

CREATE DATABASE IF NOT EXISTS cafe_db DEFAULT CHARACTER SET utf8mb4;
USE cafe_db;

-- 1. 테이블 생성
DROP TABLE IF EXISTS menu;
CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  category VARCHAR(20) NOT NULL
);

-- 2. 데이터 입력
INSERT INTO menu (name, price, category) VALUES ('아메리카노', 2000, '커피');
INSERT INTO menu (name, price, category) VALUES ('카페라떼', 3000, '커피');
INSERT INTO menu (name, price, category) VALUES ('캐모마일', 2000, '티');
INSERT INTO menu (name, price, category) VALUES ('쿠키', 1000, '디저트');

SELECT * FROM menu;

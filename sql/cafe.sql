-- 카페 메뉴 테이블 생성 + 데이터 입력 (MySQL 콘솔용)
-- 사용법: mysql -u root -p  →  mysql> source sql/cafe.sql
-- (npm run initdb 로도 같은 작업을 할 수 있습니다)

CREATE DATABASE IF NOT EXISTS cafe_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_db;

-- ① 테이블 생성
DROP TABLE IF EXISTS menu;
CREATE TABLE menu (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(50) NOT NULL,
  price    INT NOT NULL,
  category VARCHAR(20) NOT NULL
) DEFAULT CHARSET = utf8mb4;

-- ② 데이터 입력
INSERT INTO menu (name, price, category) VALUES
  ('아메리카노', 2000, '커피'),
  ('카페라떼',   3000, '커피'),
  ('캐모마일',   2000, '티'),
  ('쿠키',       1000, '디저트');

SHOW TABLES;
SELECT * FROM menu;

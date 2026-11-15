# ☕ 카페 메뉴 CRUD 웹 페이지

- 학번/이름: 202638003 박현지
- GitHub: [aa98229975-a11y](https://github.com/aa98229975-a11y)

Node.js(express + ejs + mysql2)와 MySQL로 만든 카페 메뉴 관리 페이지입니다.

| 기능 | 주소 | 설명 |
| --- | --- | --- |
| 조회 (Read) | `GET /` | 메뉴 목록 |
| 등록 (Create) | `GET/POST /menu/add` | 새 메뉴 추가 |
| 수정 (Update) | `GET/POST /menu/edit/:id` | 메뉴 이름·가격·카테고리 수정 |
| 삭제 (Delete) | `POST /menu/delete/:id` | 메뉴 삭제 |

## 테이블 (menu)

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | INT, PK, AUTO_INCREMENT | 메뉴 번호 |
| name | VARCHAR(50) | 메뉴 이름 |
| price | INT | 가격(원) |
| category | VARCHAR(20) | 커피 / 티 / 음료 / 디저트 |

기본 데이터: 아메리카노 2000 커피 · 카페라떼 3000 커피 · 캐모마일 2000 티 · 쿠키 1000 디저트

## 폴더 구조

```
cafe/
├─ app.js            # 서버 + 라우터 (CRUD)
├─ db.js             # MySQL 연결 (mysql2 커넥션 풀)
├─ init-db.js        # DB·테이블 생성 + 기본 데이터 입력
├─ sql/cafe.sql      # 같은 작업을 MySQL 콘솔에서 할 때 쓰는 SQL
├─ public/style.css
└─ views/
   ├─ index.ejs      # 목록
   ├─ form.ejs       # 등록/수정 폼
   ├─ error.ejs
   └─ partials/      # header.ejs, footer.ejs
```

## 실행 방법

```bash
npm install
copy .env.example .env      # .env 에 MySQL 계정/비밀번호 입력
npm run initdb              # cafe_db 데이터베이스, menu 테이블, 기본 데이터 생성
npm start                   # http://localhost:3000
```

// app.js - 카페 메뉴 CRUD 웹 서버 (express + ejs + mysql2)
const path = require('path');
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const CATEGORIES = ['커피', '티', '음료', '디저트'];
const MESSAGES = {
  added: '메뉴를 등록했습니다.',
  updated: '메뉴를 수정했습니다.',
  deleted: '메뉴를 삭제했습니다.',
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 모든 화면에서 쓰는 값
app.locals.owner = process.env.APP_OWNER || '';
app.locals.categories = CATEGORIES;
app.locals.won = (n) => Number(n).toLocaleString('ko-KR') + '원';

// 폼 입력값 정리 + 검사
function readForm(body) {
  const menu = {
    name: String(body.name || '').trim(),
    price: String(body.price || '').trim(),
    category: String(body.category || '').trim(),
  };
  const errors = [];
  if (!menu.name) errors.push('메뉴 이름을 입력하세요.');
  else if (menu.name.length > 50) errors.push('메뉴 이름은 50자 이내로 입력하세요.');
  if (!/^\d+$/.test(menu.price)) errors.push('가격은 0 이상의 숫자로 입력하세요.');
  else if (Number(menu.price) > 1000000) errors.push('가격은 1,000,000원 이하로 입력하세요.');
  if (!menu.category) errors.push('카테고리를 선택하세요.');
  return { menu, errors };
}

function renderForm(res, { id, menu, errors = [] }) {
  const isEdit = id !== undefined;
  res.status(errors.length ? 400 : 200).render('form', {
    title: isEdit ? '메뉴 수정' : '메뉴 등록',
    action: isEdit ? `/menu/edit/${id}` : '/menu/add',
    submitLabel: isEdit ? '수정하기' : '등록하기',
    menu,
    errors,
  });
}

function notFound(res) {
  res.status(404).render('error', {
    title: '찾을 수 없음',
    message: '요청한 메뉴 또는 페이지가 없습니다.',
    hint: '',
  });
}

// [R] 메뉴 목록
app.get('/', async (req, res) => {
  const [menus] = await pool.query('SELECT id, name, price, category FROM menu ORDER BY id');
  res.render('index', { title: '메뉴 목록', menus, msg: MESSAGES[req.query.msg] || '' });
});

// [C] 메뉴 등록
app.get('/menu/add', (req, res) => {
  renderForm(res, { menu: { name: '', price: '', category: CATEGORIES[0] } });
});

app.post('/menu/add', async (req, res) => {
  const { menu, errors } = readForm(req.body);
  if (errors.length) return renderForm(res, { menu, errors });

  await pool.query('INSERT INTO menu (name, price, category) VALUES (?, ?, ?)', [
    menu.name,
    Number(menu.price),
    menu.category,
  ]);
  res.redirect('/?msg=added');
});

// [U] 메뉴 수정
app.get('/menu/edit/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, price, category FROM menu WHERE id = ?', [
    req.params.id,
  ]);
  if (rows.length === 0) return notFound(res);
  renderForm(res, { id: rows[0].id, menu: rows[0] });
});

app.post('/menu/edit/:id', async (req, res) => {
  const { menu, errors } = readForm(req.body);
  if (errors.length) return renderForm(res, { id: req.params.id, menu, errors });

  const [result] = await pool.query(
    'UPDATE menu SET name = ?, price = ?, category = ? WHERE id = ?',
    [menu.name, Number(menu.price), menu.category, req.params.id]
  );
  if (result.affectedRows === 0) return notFound(res);
  res.redirect('/?msg=updated');
});

// [D] 메뉴 삭제
app.post('/menu/delete/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM menu WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return notFound(res);
  res.redirect('/?msg=deleted');
});

// 없는 주소
app.use((req, res) => notFound(res));

// 오류 처리 (DB 연결 문제 등)
const DB_HINTS = {
  ECONNREFUSED: 'MySQL 서버가 실행 중인지 확인하세요.',
  ER_ACCESS_DENIED_ERROR: '.env 파일의 DB_USER / DB_PASSWORD 값을 확인하세요.',
  ER_BAD_DB_ERROR: '먼저 "npm run initdb" 를 실행해 데이터베이스를 만드세요.',
  ER_NO_SUCH_TABLE: '먼저 "npm run initdb" 를 실행해 menu 테이블을 만드세요.',
};

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: '오류',
    message: err.message,
    hint: DB_HINTS[err.code] || '',
  });
});

app.listen(PORT, () => {
  console.log(`카페 메뉴 서버 실행 중: http://localhost:${PORT}`);
});

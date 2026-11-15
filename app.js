const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

// ejs 사용 설정
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// form으로 넘어온 값(req.body) 받으려고 넣음
app.use(express.urlencoded({ extended: false }));
// css 파일 폴더
app.use(express.static(__dirname + '/public'));

// 카테고리 선택 목록
const categories = ['커피', '티', '음료', '디저트'];

// 입력값 확인용 (이름 비었거나 가격이 숫자 아니면 false)
function checkInput(name, price) {
  if (!name || name.trim() == '') return false;
  if (price === '' || isNaN(price) || Number(price) < 0) return false;
  return true;
}

// ** 메뉴 목록 보여주는 부분임 (조회)
app.get('/', (req, res) => {
  db.query('SELECT * FROM menu ORDER BY id', (err, rows) => {
    if (err) {
      console.log(err);
      return res.send('DB 오류 : ' + err.message);
    }
    res.render('index', { menus: rows });
  });
});

// ** 메뉴 등록 화면
app.get('/menu/add', (req, res) => {
  res.render('form', {
    title: '메뉴 등록',
    action: '/menu/add',
    menu: { name: '', price: '', category: '커피' },
    categories: categories,
  });
});

// ** 등록 버튼 누르면 여기로 옴 -> insert 하는 부분임
app.post('/menu/add', (req, res) => {
  const { name, price, category } = req.body;

  if (!checkInput(name, price)) {
    return res.send("<script>alert('메뉴 이름과 가격을 확인해주세요.'); history.back();</script>");
  }

  const sql = 'INSERT INTO menu (name, price, category) VALUES (?, ?, ?)';
  db.query(sql, [name.trim(), price, category], (err) => {
    if (err) {
      console.log(err);
      return res.send('등록 실패');
    }
    res.redirect('/');
  });
});

// ** 메뉴 수정 화면 (id로 기존 값 불러옴)
app.get('/menu/edit/:id', (req, res) => {
  db.query('SELECT * FROM menu WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.send('DB 오류 : ' + err.message);
    }
    if (rows.length == 0) {
      return res.send("<script>alert('없는 메뉴입니다.'); location.href='/';</script>");
    }
    res.render('form', {
      title: '메뉴 수정',
      action: '/menu/edit/' + rows[0].id,
      menu: rows[0],
      categories: categories,
    });
  });
});

// ** 수정 버튼 누르면 여기로 옴 -> update 하는 부분임
app.post('/menu/edit/:id', (req, res) => {
  const { name, price, category } = req.body;

  if (!checkInput(name, price)) {
    return res.send("<script>alert('메뉴 이름과 가격을 확인해주세요.'); history.back();</script>");
  }

  const sql = 'UPDATE menu SET name = ?, price = ?, category = ? WHERE id = ?';
  db.query(sql, [name.trim(), price, category, req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.send('수정 실패');
    }
    res.redirect('/');
  });
});

// ** 삭제 버튼 누르면 여기로 옴 -> delete 하는 부분임
app.post('/menu/delete/:id', (req, res) => {
  db.query('DELETE FROM menu WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.send('삭제 실패');
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log('서버 실행 http://localhost:' + port);
});

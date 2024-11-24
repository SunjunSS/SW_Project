const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3005;

app.use(cors());
app.use(bodyParser.json());

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sw_project'
});

// 로그인 상태 확인 미들웨어
const checkLogin = (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  next();
};

// 책 좋아요 라우트 추가
app.post("/api/books/like", checkLogin, (req, res) => {
  const {
    user_id, 
    title, 
    ISBN13, 
    genre,
    price_standard,
    pricesales
  } = req.body; 

  // 중복 체크 쿼리
  const checkDuplicateQuery = 'SELECT * FROM books WHERE ISBN = ? AND user_id = ?';
  connection.query(checkDuplicateQuery, [ISBN13, user_id], (checkError, checkResults) => {
    if (checkError) {
      return res.status(500).json({ 
        message: '데이터베이스 오류', 
        error: checkError 
      });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ 
        message: '이미 좋아요한 책입니다' 
      });
    }

    const insertQuery = `
      INSERT INTO books 
      (user_id, title, author, ISBN13, genre, 
       price_standard, pricesales) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id, 
      title,
      author, 
      ISBN13, 
      genre,
      price_standard,
      pricesales
    ];

    connection.query(insertQuery, values, (insertError, insertResults) => {
      if (insertError) {
        return res.status(500).json({ 
          message: '책 저장 중 오류', 
          error: insertError 
        });
      }

      res.status(201).json({ 
        message: '책이 성공적으로 저장되었습니다', 
        bookId: insertResults.insertId 
      });
    });
  });
});

// 좋아요 취소 라우트
app.delete("/api/books/unlike/:isbn13", checkLogin, (req, res) => {
  const { ISBN13 } = req.params;
  const { user_id } = req.body;

  const deleteQuery = 'DELETE FROM books WHERE ISBN = ? AND user_id = ?';
  connection.query(deleteQuery, [ISBN13, user_id], (deleteError, deleteResults) => {
    if (deleteError) {
      return res.status(500).json({ 
        message: '좋아요 취소 중 오류', 
        error: deleteError 
      });
    }

    if (deleteResults.affectedRows === 0) {
      return res.status(404).json({ 
        message: '해당 책을 찾을 수 없습니다' 
      });
    }

    res.status(200).json({ 
      message: '좋아요가 취소되었습니다' 
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3005;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sw_project'
});

// 책 좋아요 라우트 추가
app.post("/api/books/like", (req, res) => {
  const {
    user_id,
    title,
    ISBN,
    genre,
    price_standard,
    pricesales
  } = req.body;

  // 중복 체크 쿼리
  const checkDuplicateQuery = 'SELECT * FROM books WHERE ISBN = ? AND user_id = ?';
  connection.query(checkDuplicateQuery, [ISBN, user_id], (checkError, checkResults) => {
    if (checkError) {
      return res.status(500).json({
        message: '데이터베이스 오류',
        error: checkError
      });
    }

    // 이미 좋아요한 책이면 추가하지 않음
    if (checkResults.length > 0) {
      return res.status(409).json({
        message: '이미 좋아요한 책입니다'
      });
    }

    // 새 책 추가 쿼리
    const insertQuery = `
      INSERT INTO books
      (user_id, title, author,ISBN13, genre,
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
app.delete("/api/books/unlike/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { user_id } = req.body;

  const deleteQuery = 'DELETE FROM books WHERE ISBN = ? AND user_id = ?';
  connection.query(deleteQuery, [isbn, user_id], (deleteError, deleteResults) => {
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
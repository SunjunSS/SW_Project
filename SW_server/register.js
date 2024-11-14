// server.js
<<<<<<< HEAD
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3003;
const cors = require("cors"); // CORS 미들웨어 추가
=======
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3003;
const cors = require('cors'); // CORS 미들웨어 추가
>>>>>>> kmkang

// CORS 허용
app.use(cors());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
<<<<<<< HEAD
  host: "127.0.0.1", // MySQL 서버 주소
  user: "root", // MySQL 사용자 이름
  password: "1234", // MySQL 비밀번호
  port: 3306,// mysql 포트번호
  database: "sw_project", // 사용할 데이터베이스
=======
  host: '127.0.0.1', // MySQL 서버 주소
  user: 'root', // MySQL 사용자 이름
  password: '1234', // MySQL 비밀번호
  port: 3306, // mysql 포트번호
  database: 'sw_project', // 사용할 데이터베이스
>>>>>>> kmkang
});

db.connect((err) => {
  if (err) {
<<<<<<< HEAD
    console.error("DB 연결 오류:", err);
    return;
  }
  console.log("DB 연결 성공");
=======
    console.error('DB 연결 오류:', err);
    return;
  }
  console.log('DB 연결 성공');
>>>>>>> kmkang
});

app.use(bodyParser.json());

// 회원가입 라우트
<<<<<<< HEAD
app.post("/api/register", async (req, res) => {
=======
app.post('/api/register', async (req, res) => {
>>>>>>> kmkang
  const { user_name, user_password, email, user_birthdate } = req.body;

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(user_password, 10);

  const sql =
<<<<<<< HEAD
    "INSERT INTO users (user_name, user_password, email, user_birthdate) VALUES (?, ?, ?, ?)";
=======
    'INSERT INTO users (user_name, user_password, email, user_birthdate) VALUES (?, ?, ?, ?)';
>>>>>>> kmkang
  db.query(
    sql,
    [user_name, hashedPassword, email, user_birthdate],
    (err, result) => {
      if (err) {
<<<<<<< HEAD
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "이미 사용 중인 이메일입니다." });
        }
        console.error("DB 삽입 오류:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }
      res.status(201).json({ message: "회원가입이 완료되었습니다." });
=======
        if (err.code === 'ER_DUP_ENTRY') {
          return res
            .status(400)
            .json({ message: '이미 사용 중인 이메일입니다.' });
        }
        console.error('DB 삽입 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }
      res.status(201).json({ message: '회원가입이 완료되었습니다.' });
>>>>>>> kmkang
    }
  );
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

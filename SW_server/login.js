const express = require("express");
const cors = require("cors"); // CORS 모듈 불러오기
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3001;

// CORS 미들웨어 추가
app.use(cors());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  port: 3306,
  database: "sw_project",
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 오류:", err);
    return;
  }
  console.log("DB 연결 성공");
});

app.use(bodyParser.json());

// 로그인 API 예시
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "이메일이 존재하지 않습니다." });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.user_password);

    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    res.status(200).json({ message: "로그인 성공!" });
  });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

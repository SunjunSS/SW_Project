// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 80; // AWS에서 사용 중인 포트는 80번
const cors = require("cors");

// CORS 허용
app.use(cors({
  origin: "http://localhost:5177", // 프론트엔드 주소
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sw_project",
  port: 443
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 오류:", err);
    return;
  }
  console.log("DB 연결 성공");
});

// 회원가입 라우트 (POST)
app.post("/api/register", async (req, res) => {
  const { user_name, user_password, email, user_birthdate } = req.body;
  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(user_password, 10);
  const sql =
    "INSERT INTO users (user_name, user_password, email, user_birthdate) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [user_name, hashedPassword, email, user_birthdate],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "이미 사용 중인 이메일입니다." });
        }
        console.error("DB 삽입 오류:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }
      res.status(201).json({ message: "회원가입이 완료되었습니다." });
    }
  );
});

// 회원 정보 가져오기 (GET)
app.get("/api/register", (req, res) => {
  const sql = "SELECT user_name, user_password ,email, user_birthdate FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB 쿼리 오류:", err);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
    res.status(200).json({ users: results });
  });
});

// HTTP 서버 (포트 80)
const http = require("http");
http.createServer(app).listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 http://43.200.4.199:${PORT}에서 실행 중입니다.`);
});
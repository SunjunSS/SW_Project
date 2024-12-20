// login.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 80;
const cors = require("cors");
const axios = require('axios');

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

// 인증 상태 관리
let authState = {
  isLoggedIn: false,
  currentUser: null
};

// 로그인 상태 업데이트 API
app.post("/api/auth/login", (req, res) => {
  const { user } = req.body;
  authState.isLoggedIn = true;
  authState.currentUser = user;
  res.status(200).json({
    message: "로그인 상태가 업데이트되었습니다.",
    authState
  });
});

// 로그아웃 상태 업데이트 API
app.post("/api/auth/logout", (req, res) => {
  authState.isLoggedIn = false;
  authState.currentUser = null;
  res.status(200).json({
    message: "로그아웃 상태가 업데이트되었습니다.",
    authState
  });
});

// 현재 로그인 상태 확인 API
app.get("/api/auth/status", (req, res) => {
  res.status(200).json({ authState });
});

// 로그인 API (POST)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT user_name, email, user_password FROM users WHERE email = ?";

  try {
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

      // 로그인 성공시 현재 사용자 정보 저장 및 상태 업데이트
      const userData = {
        name: user.user_name,
        email: user.email
      };

      // authState 직접 업데이트
      authState.isLoggedIn = true;
      authState.currentUser = userData;

      res.status(200).json({
        message: "로그인 성공!",
        user: userData,
        authState: authState
      });
    });
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 현재 로그인한 사용자 정보 가져오기 (GET)
app.get("/api/login", (req, res) => {
  if (!authState.currentUser) {
    return res.status(401).json({ message: "로그인된 사용자가 없습니다." });
  }
  res.status(200).json({ user: authState.currentUser });
});

// HTTP 서버 (포트 80)
const http = require("http");
http.createServer(app).listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 http://43.200.4.199:${PORT}에서 실행 중입니다.`);
});
// integration.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = 80;

// OpenAI 설정
const openai = require('openai');

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS 설정: 프론트엔드 주소 허용
app.use(cors({
  origin: "http://localhost:5177",
  methods: ["GET", "POST","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 요청 본문을 JSON으로 파싱
app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sw_project",
  port: 443,
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

// 로그인 상태 확인 미들웨어 수정
const checkLogin = (req, res, next) => {
  // authState에서 로그인 상태 확인
  if (!authState.isLoggedIn || !authState.currentUser) {
    console.log('Login check failed:', { authState });
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  // user_id가 없는 경우 현재 로그인된 사용자의 ID를 요청에 추가
  if (!req.body.user_id && req.method !== 'GET') {
    req.body.user_id = authState.currentUser.id;
  }

  console.log('Login check passed:', {
    user: authState.currentUser,
    requestBody: req.body
  });

  next();
};
// 책 제목을 저장하고 가져오는 엔드포인트
let currentBookTitle = '';
let currentBookAuthor = '';

app.post("/api/book-title", (req, res) => {
  const { title, author } = req.body;
  if (!title) {
    return res.status(400).json({ error: "책 제목이 필요합니다." });
  }
  currentBookTitle = title;
  currentBookAuthor = author;
  res.status(201).json({ message: "책 제목이 저장되었습니다.", title: currentBookTitle, author: currentBookAuthor });
});

app.get("/api/book-title", (req, res) => {
  if (!currentBookTitle) {
    return res.status(404).json({ error: "저장된 책 제목이 없습니다." });
  }
  res.json({ title: currentBookTitle, author: currentBookAuthor });
});

// 인증 관련 API 엔드포인트
app.post("/api/auth/login", (req, res) => {
  const { user } = req.body;
  authState.isLoggedIn = true;
  authState.currentUser = user;
  res.status(200).json({
    message: "로그인 상태가 업데이트되었습니다.",
    authState
  });
});

app.post("/api/auth/logout", (req, res) => {
  authState.isLoggedIn = false;
  authState.currentUser = null;
  res.status(200).json({
    message: "로그아웃 상태가 업데이트되었습니다.",
    authState
  });
});

app.get("/api/auth/status", (req, res) => {
  res.status(200).json({ authState });
});

// 로그인 API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT user_name, user_id, email, user_password FROM users WHERE email = ?";

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
        email: user.email,
        id: user.user_id
      };

      // authState 업데이트
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

// 현재 로그인한 사용자 정보 가져오기
app.get("/api/login", (req, res) => {
  if (!authState.currentUser) {
    return res.status(401).json({ message: "로그인된 사용자가 없습니다." });
  }
  res.status(200).json({ user: authState.currentUser });
});

// 회원가입 API
app.post("/api/register", async (req, res) => {
  const { user_name, user_password, email, user_birthdate } = req.body;
  const hashedPassword = await bcrypt.hash(user_password, 10);
  const sql = "INSERT INTO users (user_name, user_password, email, user_birthdate) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [user_name, hashedPassword, email, user_birthdate],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
        }
        console.error("DB 삽입 오류:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }
      res.status(201).json({ message: "회원가입이 완료되었습니다." });
    }
  );
});

app.get("/api/register", (req, res) => {
  const sql = "SELECT user_name, user_password, email, user_birthdate FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB 쿼리 오류:", err);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
    res.status(200).json({ users: results });
  });
});

// OpenAI 질문-답변 엔드포인트 최신화
app.post('/api/question', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 한국인을 위한 전문적인 도서 추천 시스템입니다. 다음 규칙을 반드시 따라주세요:
1. 추천하는 책은 반드시 한국에서 알라딘 웹사이트에서 검색할 수 있는 실제 출판된 책이어야 합니다.
2. 책 제목과 저자 이름은 반드시 알라딘에서 검색할 수 있는 책이어야 합니다. 존재하지 않는 책이나 저자를 추천하지 않도록 유의해주세요.
3. 추천하는 책이 알라딘에서 검색되지 않는 경우, 그 책을 추천 목록에서 제외해주세요.
4. 책 제목은 반드시 <<한국어 제목>> 형식으로 작성하고, 각 책 제목은 반드시 <<한국어 제목>>(원어 제목) 형식으로 표시합니다.
5. 모든 추천은 한국에서 쉽게 구할 수 있는 책으로, 한국 독자에게 친숙한 책이어야 합니다.
6. 책 제목은 정확하게 알라딘에서 검색될 수 있도록 작성해야 하며, 저자와 책 제목이 정확한지 다시 한 번 확인해주세요.
7. 반드시 알라딘에서 검색할 수 있는 책만 추천해 주세요. 알라딘에서 검색할 수 없는 책은 제외하고, 해당 책이 정확히 어떤 책인지 알 수 있는 추가 정보를 제공해주세요.
8. 추천하는 책의 최대 수는 3권으로 제한되며, 시리즈물이 있을 경우 특정 편을 추천해주세요.
9. 추천 시 다음 형식을 정확히 지켜주세요:
   - 첫 번째 문장: 추천 맥락을 설명하는 문장
   - 각 책 추천: "1. <<책제목>> (원어제목) - 저자" 형식
   - 마지막 문장: 추천 책들에 대한 간단한 총평
10. 책 제목을 추천할 때 반드시 정확한 제목과 저자를 사용해 주세요. 만약 책이나 저자가 알라딘에서 검색되지 않으면 해당 책은 추천하지 않도록 하세요.
11. 참고 예시:
    1. <<인간 실격>> (人間失格) - 다자이 오사무
    2. <<사양>> (斜陽) - 다자이 오사무
    3. <<만년>> (萬年) - 다자이 오사무
    이 책들은 다자이 오사무의 대표작으로, 인간의 내면과 사회적 고뇌를 깊이 있게 탐구한 작품들입니다. 한국에서도 많은 독자에게 사랑받고 있는 작품들이니 한 번 읽어보시기를 추천합니다.`
     },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let answer = response.choices[0].message.content;
    // 응답 결과를 그대로 반환
    res.json({ answer });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 추천 알고리즘 설정
const { router: recommendRouter, searchRecommendedBooks } = require("./recommendBooks.js");  // recommendBooks.js 파일 불러오기
app.use("/api", recommendRouter); // recommendBooks.js의 라우터 활용

// userId를 전달해줌
app.get("/api/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("받은 유저 id: ", userId);

  if (!userId) {
    console.error("유저 정보 전달 안됨;;");
    return res.status(400).json({
      success: false,
      message: "사용자 ID가 전달되지 않았습니다.",
    });
  }

  try {
    const sql = `SELECT title, author FROM books WHERE user_id = ?`;
    const values = [userId];

    db.query(sql, values, async (err, userBooks) => {
      if (err) {
        console.error("DB 쿼리 오류:", err);
        return res.status(500).json({
          success: false,
          message: "추천 도서를 불러오는 중 오류가 발생했습니다.",
        });
      }

      if (!Array.isArray(userBooks)) {
        console.error("UserBooks is not an array:", userBooks);
        return res.status(500).json({
          success: false,
          message: "데이터 형식 오류가 발생했습니다.",
        });
      }

      console.log(userBooks);

      const authors = [...new Set(userBooks.map((book) => book.author))]; // 중복 제거된 작가 목록
      const excludedTitles = userBooks.map((book) => book.title);

      console.log("검색할 작가 목록:", authors);
      console.log("제외할 책 제목 목록:", excludedTitles);

      const recommendedBooks = await searchRecommendedBooks(authors, excludedTitles);

      console.log("추천도서 목록의 길이: ", recommendedBooks.length);

      res.json({
        success: true,
        message:
          userBooks.length > 0
            ? "개인화된 추천을 제공합니다."
            : "추천할 도서를 찾을 수 없습니다.",
        recommendations: recommendedBooks,
      });
    }); // db.query 닫는 중괄호
  } catch (error) {
    console.error("추천 도서 검색 오류:", error);
    res.status(500).json({
      success: false,
      message: "추천 도서를 검색 중 오류가 발생했습니다.",
    });
  }
}); // app.get 닫는 중괄호
// 책 좋아요 API 엔드포인트 수정
app.post("/api/books/like", checkLogin, (req, res) => {
  const {
    title,
    ISBN13,
    genre,
    price_standard,
    pricesales,
    author,
    cover
  } = req.body;

  const user_id = authState.currentUser.id; // 현재 로그인된 사용자의 ID 사용

  // 중복 체크 쿼리
  const checkDuplicateQuery = 'SELECT * FROM books WHERE ISBN13 = ? AND user_id = ?';

  console.log('Checking for duplicate:', { ISBN13, user_id });

  db.query(checkDuplicateQuery, [ISBN13, user_id], (checkError, checkResults) => {
    if (checkError) {
      console.error("중복 체크 오류:", checkError);
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
       price_standard, pricesales,cover)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;

    const values = [
      user_id,
      title,
      author,
      ISBN13,
      genre,
      price_standard,
      pricesales,
      cover
    ];

    console.log('Inserting book:', { values });

    db.query(insertQuery, values, (insertError, insertResults) => {
      if (insertError) {
        console.error("책 저장 오류:", insertError);
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

// 좋아요 취소 API 엔드포인트 수정
app.delete("/api/books/unlike/:isbn13", checkLogin, (req, res) => {
  const { isbn13 } = req.params;
  const user_id = authState.currentUser.id; // 현재 로그인된 사용자의 ID 사용

  console.log('Unliking book:', { isbn13, user_id });

  const deleteQuery = 'DELETE FROM books WHERE ISBN13 = ? AND user_id = ?';
  db.query(deleteQuery, [isbn13, user_id], (deleteError, deleteResults) => {
    if (deleteError) {
      console.error("좋아요 취소 오류:", deleteError);
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

// 사용자별 좋아요한 책 목록 조회 API 수정
app.get("/api/books/liked", checkLogin, (req, res) => {
  const user_id = authState.currentUser.id; // 현재 로그인된 사용자의 ID 사용

  console.log('Fetching liked books for user:', { user_id });

  const query = 'SELECT * FROM books WHERE user_id = ?';
  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error("좋아요 목록 조회 오류:", error);
      return res.status(500).json({
        message: '좋아요 목록 조회 중 오류',
        error: error
      });
    }

    res.status(200).json({
      message: '좋아요 목록 조회 성공',
      books: results
    });
  });
});

// 책 좋아요 상태 확인 API 추가
app.get("/api/books/like-status/:isbn13", checkLogin, (req, res) => {
  const { isbn13 } = req.params;
  const user_id = authState.currentUser.id;

  console.log('Checking like status:', { isbn13, user_id });

  const query = 'SELECT * FROM books WHERE ISBN13 = ? AND user_id = ?';
  db.query(query, [isbn13, user_id], (error, results) => {
    if (error) {
      console.error("좋아요 상태 확인 오류:", error);
      return res.status(500).json({
        message: '좋아요 상태 확인 중 오류',
        error: error
      });
    }

    res.status(200).json({
      isLiked: results.length > 0
    });
  });
});


// 서버 상태 확인 API
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동하고 있습니다.');
});

http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 HTTP 포트 ${PORT}에서 실행 중입니다.`);
});
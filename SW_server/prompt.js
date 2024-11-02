const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 책 제목을 저장할 변수
let currentBookTitle = '';

// 책 제목을 받아서 저장하는 엔드포인트
app.post('/api/book-title', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: '책 제목이 필요합니다.' });
  }
  currentBookTitle = title;
  res.status(201).json({ message: '책 제목이 저장되었습니다.', title: currentBookTitle });
});

// 저장된 책 제목을 가져오는 엔드포인트
app.get('/api/book-title', (req, res) => {
  if (!currentBookTitle) {
    return res.status(404).json({ error: '저장된 책 제목이 없습니다.' });
  }
  res.json({ title: currentBookTitle });
});

// 기본 엔드포인트 추가 (서버 작동 확인용)
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동하고 있습니다.');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
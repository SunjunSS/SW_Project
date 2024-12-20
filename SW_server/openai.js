const express = require('express');
const openai = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = 80;

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({
  origin: "http://localhost:5177",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());
app.use(express.json());

let currentBookTitle = '';

// 책 제목을 저장하는 API
app.post('/api/book-title', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: '책 제목이 필요합니다.' });
  }
  currentBookTitle = title;
  res.status(201).json({ message: '책 제목이 저장되었습니다.', title: currentBookTitle });
});

// 저장된 책 제목을 가져오는 API
app.get('/api/book-title', (req, res) => {
  if (!currentBookTitle) {
    return res.status(404).json({ error: '저장된 책 제목이 없습니다.' });
  }
  res.json({ title: currentBookTitle });
});

// 도서 추천 질문을 처리하는 API
app.post('/api/question', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4',
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

// 서버 상태 확인 API
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동하고 있습니다.');
});

http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 HTTP 포트 ${PORT}에서 실행 중입니다.`);
});
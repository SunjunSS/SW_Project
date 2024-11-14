const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const openai = require('openai');
const PORT = 3004;
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
}); // OpenAI 클라이언트 생성

/**
 * 주어진 질문에 대한 답변을 반환하는 메서드
 * @param {string} question - 사용자가 입력한 질문
 * @returns {Promise<string>} - OpenAI의 답변
 */

// 사용자가 질문을 던진 경우
app.post('/api/question', async (req, res) => {
  const { question } = req.body;
  const answer = await getAnswer(question);
  res.json({ answer });
});

async function getAnswer(question) {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo', // 사용할 모델
      messages: [{ role: 'user', content: question }],
    });

    return response.choices[0].message.content; // 답변 반환
  } catch (error) {
    console.error('Error fetching answer:', error);
    throw error; // 에러 발생 시 에러를 던짐
  }
}

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

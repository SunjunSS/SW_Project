const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let storedLocations = []; // 장소를 저장할 임시 배열

// 기본 엔드포인트 추가
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동하고 있습니다.');
});

// 프론트엔드에서 장소 저장 요청 처리
app.post('/api/places', (req, res) => {
  const { lat, lng, name } = req.body;
  if (!lat || !lng || !name) {
    return res.status(400).json({ error: '위도, 경도, 이름이 필요합니다.' });
  }

  const newLocation = { lat, lng, name };
  storedLocations.push(newLocation);
  res.status(201).json({ message: '장소가 성공적으로 저장되었습니다.', location: newLocation });
});

// 저장된 장소를 프론트엔드에 전송
app.get('/api/places', (req, res) => {
  res.json(storedLocations); // 저장된 장소 목록을 반환
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

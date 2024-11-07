<template>
  <PagesHeader />
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div :class="message.type">{{ message.text }}</div>
        <!-- 책 컴포넌트를 답변으로 추가 -->
        <BookSlides v-if="message.type === 'book-message'" :books="message.books" />
      </div>
    </div>
    <div class="input-container">
      <textarea
        v-model="userInput"
        placeholder="책에 대해 궁금한 점을 입력하세요..."
        @keydown.enter="handleSubmit"
        rows="2"
      ></textarea>
      <button @click="handleSubmit">질문하기</button>
    </div>
  </div>
</template>

<script>
import router from '../router.js';
import axios from 'axios';
import PagesHeader from '@/components/Bar/PagesHeader.vue';
import BookSlides from '@/components/Book/BookSlides.vue'; // BookSlides 컴포넌트 추가

export default {
  components: {
    PagesHeader,
    BookSlides // BookSlides 컴포넌트 등록
  },
  data() {
    return {
      userInput: '', // 사용자의 입력값
      messages: [], // 채팅 메시지 목록
      bookTitle: ''
    };
  },
  methods: {
    async sendBookTitle(title) {
      try {
        this.bookTitle = title;
        await axios.post('http://localhost:3000/api/book-title', {
          title: this.bookTitle
        });
        router.push('/bookdetail');
      } catch (error) {
        console.error('책 제목 전송 실패:', error);
      }
    },
    async handleSubmit() {
      if (this.userInput.trim()) {
        // 사용자의 메시지 추가
        this.messages.push({ text: this.userInput, type: 'user-message' });
        
        // 서버에서 책 관련 정보를 받아오기
        try {
          const response = await axios.post('http://localhost:3000/api/get-book-info', {
            title: this.userInput
          });

          // 책 내용 받아오기 (예시로 책 내용이 포함된 응답을 표시)
          if (response.data.books) {
            // 책 컴포넌트를 출력할 수 있도록 배열 형태로 저장
            this.messages.push({
              type: 'book-message',
              books: response.data.books
            });
          } else {
            this.messages.push({ text: '책 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.', type: 'bot-message' });
          }
        } catch (error) {
          this.messages.push({ text: '책 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.', type: 'bot-message' });
        }
        
        // 입력값 초기화
        this.userInput = '';
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.messages {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  text-align: right;
  background-color: #d0f0c0;
  padding: 10px;
  border-radius: 10px;
}

.bot-message {
  text-align: left;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  margin-bottom: 10px;
}

button {
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #CD853F;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #D2691E;
}
</style>

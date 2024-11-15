<template>
  <PagesHeader />
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index">
      <UserMessage v-if="message.isUser" :message="message" />
      <OpenAIMessage v-if="!message.isUser" :message="message" />
    </div>
  </div>
  <div class="prompt-container">
    <textarea
      id="input-box"
      type="text"
      @input="adjustHeight"
      v-model="userInput"
      placeholder="메시지를 입력해주세요."
      cols="50"
    />
    <v-icon
      id="search-btn"
      icon="mdi-arrow-up-bold-circle"
      color="brown-darken-1"
      size="x-large"
      @click="sendMessage"
    ></v-icon>
  </div>
</template>

<script>
import PagesHeader from '../components/Bar/PagesHeader.vue'
import axios from 'axios' // axios 임포트
import UserMessage from '../components/Chat/UserMessage.vue'
import OpenAIMessage from '../components/Chat/OpenAIMessage.vue'

export default {
  data() {
    return {
      userInput: '',
      messages: [] // 모든 사용자와 AI 메시지를 저장할 배열
    }
  },
  components: {
    PagesHeader,
    UserMessage,
    OpenAIMessage
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim()) {
        const userMessage = { text: this.userInput, isUser: true }
        this.messages.push(userMessage)

        try {
          const response = await axios.post(
            'http://43.200.4.199/api/question',
            { question: this.userInput },
            {
              headers: {
                'Content-Type': 'application/json'
              }
              // withCredentials 옵션 제거
            }
          )

          if (response.data && response.data.answer) {
            const aiMessage = { text: response.data.answer, isUser: false }
            this.messages.push(aiMessage)
          }
        } catch (error) {
          console.error('서버 전송 오류:', error)
          const errorMessage = {
            text: '서버와의 통신 중 오류가 발생했습니다.',
            isUser: false
          }
          this.messages.push(errorMessage)
        }

        this.userInput = ''
      }
    },
    adjustHeight(event) {
      const textarea = event.target
      textarea.style.height = 'auto' // 높이를 초기화
      const lineHeight = 50 // 각 줄의 높이 (50px)
      const lines = Math.min(Math.floor(textarea.scrollHeight / lineHeight), 6) // 줄 수 계산 (최대 6줄)
      textarea.style.height = `${lines * lineHeight}px` // 높이 조정
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 170px 30px 150px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  position: relative; /* 부모 요소에 상대 위치 설정 */
}

/* 화면 크기가 768px 이하일 때 padding 값을 줄임 */
@media (max-width: 768px) {
  .chat-container {
    padding: 30px 60px 30px 50px;
  }
}

@media (max-width: 1000px) {
  .chat-container {
    padding: 30px 120px 30px 100px;
  }
}

.prompt-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin-top: 30px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

#input-box {
  display: flex;
  position: absolute; /* 절대 위치 설정 */
  bottom: 0; /* 하단에 위치 */
  left: 0; /* 왼쪽 정렬 */
  right: 0; /* 오른쪽 정렬 */
  margin-top: 2rem;
  margin-bottom: 2rem;
  border: 2px #cfcfcf solid;
  border-radius: 15px;
  padding: 0.75rem 1rem;
  width: 100%;
  height: 50px; /* 기본 높이 설정 (1줄) */
  max-height: 200px;
  resize: none; /* 사용자가 크기를 조정하지 못하도록 설정 */
  overflow-y: auto; /* 스크롤 허용 */
  box-sizing: border-box; /* 패딩과 테두리를 포함한 크기 계산 */
  transition: height 0.2s ease; /* 높이 변화에 애니메이션 추가 */
}

#search-btn {
  position: absolute;
  right: 10px;
  top: 73px;
}
</style>

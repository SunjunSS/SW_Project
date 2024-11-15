<template>
  <PagesHeader />
  <div class="chat-container" ref="chatContainer">
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
import '@/styles/Chatbot.css'
import '@/styles/UserMessage.css'
import '@/styles/OpenAIMessage.css'

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
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.chatContainer
      container.scrollTop = container.scrollHeight
    },
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

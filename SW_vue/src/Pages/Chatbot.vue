<template>
  <PagesHeader />
  <div class="chat-container" ref="chatContainer">
    <div v-for="(message, index) in messages" :key="index">
      <UserMessage v-if="message.isUser" :message="message" />
      <OpenAIMessage v-if="!message.isUser" :message="message" />
    </div>
  </div>
  <ChatbotPrompt v-model="userInput" @click="sendMessage" @input="adjustHeight" />
</template>

<script>
import PagesHeader from '../components/Bar/PagesHeader.vue'
import axios from 'axios'
import UserMessage from '../components/Chat/UserMessage.vue'
import OpenAIMessage from '../components/Chat/OpenAIMessage.vue'
import ChatbotPrompt from '../components/Prompt/ChatbotPrompt.vue'
import '@/styles/UserMessage.css'
import '@/styles/OpenAIMessage.css'

export default {
  data() {
    return {
      userInput: '',
      messages: []
    }
  },
  components: {
    PagesHeader,
    UserMessage,
    OpenAIMessage,
    ChatbotPrompt
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
      this.$nextTick(() => {
        const container = this.$refs.chatContainer
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth' // 부드러운 스크롤
          })
        }
      })
    },
    async sendMessage() {
      if (this.userInput.trim()) {
        const userMessage = { text: this.userInput, isUser: true }
        this.messages.push(userMessage)

        // textarea 내용 초기화
        this.userInput = ''

        try {
          const response = await axios.post(
            'http://43.200.4.199/api/question',
            { question: userMessage.text },
            {
              headers: {
                'Content-Type': 'application/json'
              }
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
  padding: 50px 15% 30px 15%;
  height: calc(100vh - 180px); /* ChatbotPrompt를 고려하여 높이 조정 */
  overflow-y: auto;
  box-sizing: border-box;
}

.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: #cfcfcf;
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>

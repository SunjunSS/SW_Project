<template>
  <PagesHeader />
  <div class="chat-container" ref="chatContainer">
    <div v-for="(message, index) in messages" :key="index">
      <UserMessage v-if="message.isUser" :message="message" />
      <OpenAIMessage v-if="!message.isUser" :message="message" />
    </div>
  </div>
  <ChatbotPrompt v-model="userInput" @send-message="sendMessage" />
</template>

<script>
import PagesHeader from '../components/Bar/PagesHeader.vue'
import axios from 'axios'
import UserMessage from '../components/Chat/UserMessage.vue'
import OpenAIMessage from '../components/Chat/OpenAIMessage.vue'
import ChatbotPrompt from '../components/Prompt/ChatbotPrompt.vue'

export default {
  components: {
    PagesHeader,
    UserMessage,
    OpenAIMessage,
    ChatbotPrompt
  },
  data() {
    return {
      userInput: '',
      messages: []
    }
  },
  async created() {
    const initialMessage = this.$route.query.initialMessage
    if (initialMessage) {
      this.sendMessage(initialMessage)
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => this.scrollToBottom())
      },
      deep: true
    }
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.chatContainer
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    },
    async sendMessage(message = this.userInput.trim()) {
      if (!message) return

      // 사용자 메시지 추가
      this.messages.push({ text: message, isUser: true })

      // 입력창 초기화
      this.userInput = ''

      try {
        const response = await axios.post(
          'http://43.200.4.199/api/question',
          { question: message },
          { headers: { 'Content-Type': 'application/json' } }
        )

        // if (response.data && response.data.answer) {
        //   this.messages.push({ text: response.data.answer, isUser: false })
        // }

        const answer = response.data // response.data가 전체 텍스트를 포함

        this.messages.push({ text: answer, isUser: false })
      } catch (error) {
        console.error('서버 오류:', error)
        this.messages.push({
          text: '서버와의 통신 중 오류가 발생했습니다.',
          isUser: false
        })
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  padding: 50px 15% 30px 15%;
  height: calc(100vh - 180px);
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

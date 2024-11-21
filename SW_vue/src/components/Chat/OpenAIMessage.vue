<template>
  <div class="ai-message">
    <img class="profile-image" :src="profileImage" alt="AI" />
    <div class="message-text">
      <div v-for="(part, index) in parsedMessage" :key="index">
        <a
          v-if="part.isBookTitle"
          href="#"
          class="book-title"
          @click.prevent="sendMessage(part.title, part.author)"
        >
          {{ part.text }}
        </a>
        <span v-else>{{ part.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import defaultProfileImage from '@/assets/headerImage.png'
import '@/styles/OpenAIMessage.css'
import axios from 'axios'
import router from '@/router'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    profileImage: {
      type: String,
      default: defaultProfileImage
    }
  },
  computed: {
    parsedMessage() {
      const text = this.message.text
      const parts = []
      let currentIndex = 0

      // <<책제목>> (원제) - 작가 패턴을 찾아서 분리
      const regex = /<<([^>]+)>>\s*(?:\([^)]+\))?\s*-\s*([^\n]+)/g
      let match

      while ((match = regex.exec(text)) !== null) {
        // 책 제목 앞의 일반 텍스트 추가
        if (match.index > currentIndex) {
          parts.push({
            text: text.substring(currentIndex, match.index),
            isBookTitle: false
          })
        }

        const title = match[1].trim()
        const author = match[2].trim()

        // 책 제목과 작가 정보 추가
        parts.push({
          text: `${title} - ${author}`,
          title: title,
          author: author,
          isBookTitle: true
        })

        currentIndex = match.index + match[0].length
      }

      // 마지막 남은 텍스트 추가
      if (currentIndex < text.length) {
        parts.push({
          text: text.substring(currentIndex),
          isBookTitle: false
        })
      }

      return parts
    }
  },
  methods: {
    async sendMessage(title, author) {
      try {
        await axios.post('http://43.200.4.199:80/api/book-title', {
          title: title,
          author: author
        })
        router.push('/bookdetail')
      } catch (error) {
        console.error('메시지 전송 실패:', error)
      }
    }
  }
}
</script>

<style scoped>
.book-title {
  color: blue;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
}

.book-title:hover {
  text-decoration: underline;
}

.message-text {
  line-height: 1.5;
}
</style>

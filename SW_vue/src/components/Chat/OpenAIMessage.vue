<template>
  <div class="ai-message">
    <img class="profile-image" :src="profileImage" alt="AI" />
    <div class="message-text">
      <template v-for="(part, index) in parsedMessage" :key="index">
        <br v-if="part.isNewline" />
        <a
          v-if="part.isBookTitle"
          href="#"
          class="book-title"
          @click.prevent="sendMessage(part.title, part.author)"
        >
          {{ part.title }}
        </a>
        <span v-if="part.isBookTitle && part.originalTitle">
          {{ ` (${part.originalTitle}) - ${part.author}` }}
        </span>
        <span v-else-if="part.isBookTitle && part.originalTitle === null">
          {{ ` - ${part.author}` }}
        </span>
        <span v-else>{{ part.text }}</span>
      </template>
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

      const regex = /<<([^>]+)>>(?:\s*\(([^)]+)\))?\s*-\s*([^\n]+)|\n\n|(\d+\.)/g
      let currentIndex = 0
      let match

      while ((match = regex.exec(text)) !== null) {
        if (match.index > currentIndex) {
          parts.push({
            text: text.substring(currentIndex, match.index),
            isBookTitle: false,
            isNewline: false
          })
        }

        if (match[1]) {
          const title = match[1].trim()
          const originalTitle = match[2] ? match[2].trim() : null
          const author = match[3].trim()

          console.log(`title: ${title}, originalTitle: ${originalTitle}`)

          parts.push({
            text: match[0],
            title: title,
            originalTitle: title === originalTitle ? null : originalTitle,
            author: author,
            isBookTitle: true,
            isNewline: false
          })
        }
        if (match[0] === '\n\n') {
          parts.push({
            text: '',
            isBookTitle: false,
            isNewline: true
          })
        }

        if (match[4]) {
          // 첫 번째 push: 텍스트 추가
          parts.push({
            text: match[1],
            isBookTitle: false,
            isNewline: true
          })
          parts.push({
            text: match[4],
            isBookTitle: false,
            isNewline: false
          })
        }

        currentIndex = match.index + match[0].length
      }

      if (currentIndex < text.length) {
        parts.push({
          text: text.substring(currentIndex),
          isBookTitle: false,
          isNewline: true
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

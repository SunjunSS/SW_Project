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
          @click.prevent="sendMessage(part.text)"
        >
          {{ part.text }}
        </a>
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
      const text = this.message.text;
      const parts = [];
      
      // 새로운 로직으로 메시지 파싱
      const regex = /<<([^>]+)>>|(\d+\.)|\n\n/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // 이전 텍스트 추가
        if (match.index > lastIndex) {
          parts.push({
            text: text.substring(lastIndex, match.index),
            isBookTitle: false,
            isNewline: false
          });
        }

        // 숫자로 시작하는 부분 처리 (새 줄 추가)
        if (match[2]) {
          // 첫 번째 숫자일 때는 개행을 추가하지 않음
          if (parts.length === 0 || parts[parts.length - 1].isNewline) {
            parts.push({
              text: match[0],
              isBookTitle: false,
              isNewline: false // 처음 숫자는 개행 없이 추가
            });
          } else {
            parts.push({
              text: match[0],
              isBookTitle: false,
              isNewline: true // 이후 숫자부터는 개행 추가
            });
          }
        }

        // 책 제목 처리
        if (match[1]) {
          parts.push({
            text: match[1],
            isBookTitle: true,
            isNewline: false
          });
        }

        // 이중 개행 처리
        if (match[0] === '\n\n') {
          parts.push({
            text: '',
            isBookTitle: false,
            isNewline: true
          });
          parts.push({
            text: '',
            isBookTitle: false,
            isNewline: true
          });
        }

        lastIndex = match.index + match[0].length;
      }

      // 마지막 남은 텍스트 추가
      if (lastIndex < text.length) {
        parts.push({
          text: text.substring(lastIndex),
          isBookTitle: false,
          isNewline: false
        });
      }

      return parts;
    }
  },
  methods: {
    async sendMessage(bookTitle) {
      try {
        await axios.post('http://43.200.4.199:80/api/book-title', {
          title: bookTitle
        });
        router.push('/bookdetail');
      } catch (error) {
        console.error('메시지 전송 실패:', error);
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
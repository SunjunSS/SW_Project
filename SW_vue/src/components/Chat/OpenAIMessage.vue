<template>
  <div class="ai-message">
    <img class="profile-image" :src="profileImage" alt="AI" />
    <div class="message-text">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import defaultProfileImage from '@/assets/headerImage.png' // 이미지 파일을 import
import '@/styles/OpenAIMessage.css'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    profileImage: {
      type: String,
      default: defaultProfileImage // 기본 AI 프로필 이미지 경로
    }
  }
}
</script>

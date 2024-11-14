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

<style scoped>
.ai-message {
  align-self: flex-start; /* 왼쪽 정렬 */
  background-color: #f1f1f1;
  margin: 5px;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.profile-image {
  width: 30px;
  height: 30px;
}
</style>

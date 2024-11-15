<template>
  <div class="user-message">
    <img class="profile-image" :src="profileImage" alt="user" />
    <div class="message-text">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import defaultProfileImage from '@/assets/user.svg' // 이미지 파일을 import
import '@/styles/UserMessage.css'
export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    profileImage: {
      type: String,
      default: defaultProfileImage // 기본 프로필 이미지 경로
    }
  }
}
</script>

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

<style scoped>
.user-message {
  align-self: flex-end; /* 오른쪽 정렬 */
  background-color: #d1e7dd;
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

<template>
  <v-btn class="btn" @click="goToTestPage()">확인</v-btn>
</template>

<script>
import router from '../../router.js';

export default {
  methods: {
    goToTestPage() {
      router.push('/test');
    }
  }
};
</script>

<style>
.btn {
  display: flex; /* 블록 레벨로 변경 */
  margin: 0 auto; /* 중앙 정렬 */
  width: 200px; /* 원하는 너비 설정 */
}
</style>

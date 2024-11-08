<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="login">
      <v-text-field
        v-model="email"
        :rules="[v => !!v || '이메일을 입력하세요.', v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력하세요.']"
        label="이메일"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[v => !!v || '비밀번호를 입력하세요.']"
        label="비밀번호"
        type="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" @click="login">로그인</v-btn>
    </v-form>

    <!-- 회원가입 페이지로 이동하는 버튼 -->
    <v-btn text color="secondary" @click="goToRegister">회원가입</v-btn>

    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarText }}</v-snackbar>
  </v-container>
</template>

<script>
import router from "../router.js"
import axios from 'axios'; // axios 임포트

export default {
  data() {
    return {
      email: '',
      password: '',
      valid: false,
      snackbar: false,
      snackbarText: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://43.200.4.199/api/login', {
          email: this.email,
          password: this.password
        });

        if (response.data.message === "로그인 성공!") {
          this.snackbarText = "로그인 성공!";
          this.snackbar = true;
          router.push('/'); // 메인 페이지로 이동
        } else {
          this.snackbarText = response.data.message;
          this.snackbar = true;
        }
      } catch (error) {
        this.snackbarText = error.response?.data.message || '로그인 실패';
        this.snackbar = true;
      }
    },
    goToRegister() {
      // 회원가입 페이지로 이동
      router.push('/register');
    }
  }
};
</script>

<style scoped>
/* 스타일은 자유롭게 수정하세요 */
</style>

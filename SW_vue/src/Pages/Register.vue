<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="register">
      <v-text-field
        v-model="user_name"
        :rules="[v => !!v || '이름을 입력하세요.']"
        label="이름"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="[v => !!v || '이메일을 입력하세요.', v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력하세요.']"
        label="이메일"
        required
      ></v-text-field>

      <v-text-field
        v-model="user_password"
        :rules="[v => !!v || '비밀번호를 입력하세요.']"
        label="비밀번호"
        type="password"
        required
      ></v-text-field>

      <v-text-field
        v-model="user_birthdate"
        :rules="[v => !!v || '생년월일을 입력하세요.']"
        label="생년월일 (YYYY-MM-DD)"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" @click="register">회원가입</v-btn>
    </v-form>

    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarText }}</v-snackbar>
  </v-container>
</template>

<script>
import router from "../router.js"
import axios from 'axios';

export default {
  data() {
    return {
      user_name: '',
      email: '',
      user_password: '',
      user_birthdate: '',
      snackbar: false,
      snackbarText: '',
      valid: false
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://43.200.4.199/api/register', {
          user_name: this.user_name,
          email: this.email,
          user_password: this.user_password,
          user_birthdate: this.user_birthdate
        });
        this.snackbarText = response.data.message;
        // 회원가입 성공 후 메인 페이지로 이동
        router.push('/');

      } catch (error) {
        this.snackbarText = error.response?.data.message || '오류가 발생했습니다.';
      }
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
/* 스타일은 자유롭게 수정하세요 */
</style>

<template>
    <PagesHeader/>
    <div>
        <p><a @click="sendBookTitle('미움받을용기')" href="#">미움받을용기</a></p>
        <p><a @click="sendBookTitle('미드나잇라이브러리')" href="#">미드나잇라이브러리</a></p>
        <p><a @click="sendBookTitle('가면산장 살인사건')" href="#">가면산장 살인사건</a></p>
    </div>
</template>

<script>
import router from '../router.js'
import axios from 'axios';
import PagesHeader from '@/components/Bar/PagesHeader.vue'

export default {
  components: {
    PagesHeader
  },
  data() {
    return {
      bookTitle: '' // 초기값은 빈 문자열로 설정
    };
  },
  methods: {
    async sendBookTitle(title) { // 매개변수로 책 제목을 받음
      try {
        this.bookTitle = title; // 클릭된 책의 제목으로 업데이트
        // 책 제목을 서버로 전송
        await axios.post('http://43.200.4.199:80/api/book-title', {  // 서버 주소를 43.200.4.199로 변경
          title: this.bookTitle
        });
        // 전송 성공 후 Book_Detail_Information 페이지로 이동
        router.push('/bookdetail');
      } catch (error) {
        console.error('책 제목 전송 실패:', error);
      }
    }
  }
};
</script>

<style scoped>

</style>

<template>
  <PagesHeader />
  <div class="prompt-container">
    <textarea id="input-box" type="text" placeholder="오늘은 어떤 책을 읽어볼까요?" cols="50" />
    <v-icon
      id="search-btn"
      icon="mdi-arrow-up-bold-circle"
      color="brown-darken-1"
      size="x-large"
      
      @click="goToPromptPage"
    ></v-icon>
  </div>
  <BookSlides />
</template>

<script>
import router from '../../router.js'
import PagesHeader from '@/components/Bar/PagesHeader.vue'
import BookSlides from '@/components/Book/BookSlides.vue'

export default {
  components: {
    PagesHeader, // Register the PagesHeader component
    BookSlides
  },
  methods: {
    goToMapPage() {
      router.push('/map')
    },
    goToPromptPage() {
      router.push('/prompt')
    },
    goToRealPromptPage() {
      router.push('/realPrompt')
    },
  }
}
</script>

<style>
.btn {
  display: flex; /* 블록 레벨로 변경 */
  margin: 0 auto; /* 중앙 정렬 */
  width: 200px; /* 원하는 너비 설정 */
}

.prompt-container {
  /* 프롬프트 입력 부분 */
  display: flex;
  margin: 2rem auto 0 auto; /* 중앙 정렬 (4가지 속성 다같이 쓰면 top부터 시계방향으로 적용됨.) */
  position: relative; /* input 태그와 icon을 같은 블록으로 */
  height: 9rem;
  width: 70%;
}

#search-btn {
  position: absolute; /* 컨테이너 내부에서 절대 위치로 설정 */
  top: 6.6rem;
  right: 0.4rem;
}

#input-box {
  display: flex;
  margin-top: 2rem;
  border: 2px #cfcfcf solid;
  border-radius: 15px;
  padding: 0.75rem 1rem 4rem 1rem;
  width: 100%;
  /* text-indent: 1rem; 들여쓰기 속성 */
  resize: none;
}

#input-box::-webkit-scrollbar {
  /* 스크롤바 숨김 */
  display: block;
}
</style>

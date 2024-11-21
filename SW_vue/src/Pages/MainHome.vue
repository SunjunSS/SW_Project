<template>
  <PagesHeader />
  <PromptContainer
    v-model="userInput"
    placeholder="오늘은 어떤 책을 읽어볼까요?"
    @submit="handleSubmit"
  />
  <BookSlides />
  <RecommendedBookSlides />
  <PagesFooter />
</template>

<script>
import router from '../router.js'
import PagesHeader from '@/components/Bar/PagesHeader.vue'
import BookSlides from '@/components/Book/BookSlides.vue'
import PagesFooter from '@/components/Bar/PagesFooter.vue'
import PromptContainer from '@/components/Prompt/PromptContainer.vue'
import RecommendedBookSlides from '@/components/Book/RecommendedBookSlides.vue'

export default {
  components: {
    PagesHeader,
    BookSlides,
    PagesFooter,
    PromptContainer,
    RecommendedBookSlides
  },
  created() {
    // 로컬 스토리지 초기화
    localStorage.removeItem('chatMessages')
  },
  data() {
    return {
      userInput: ''
    }
  },
  methods: {
    handleSubmit(message) {
      router.push({
        path: '/chatbot',
        query: { initialMessage: message }
      })
    }
  }
}
</script>

<style>
.btn {
  display: flex;
  margin: 0 auto;
  width: 200px;
}
</style>

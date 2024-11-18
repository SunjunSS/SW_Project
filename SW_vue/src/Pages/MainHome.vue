<template>
  <PagesHeader />
  <PromptContainer placeholder="오늘은 어떤 책을 읽어볼까요?" @click="goToPromptPage" />
  <BookSlides />
  <PagesFooter />
</template>

<script>
import router from '../router.js'
import PagesHeader from '@/components/Bar/PagesHeader.vue'
import BookSlides from '@/components/Book/BookSlides.vue'
import PagesFooter from '@/components/Bar/PagesFooter.vue'
import PromptContainer from '@/components/Prompt/PromptContainer.vue'

export default {
  components: {
    PagesHeader,
    BookSlides,
    PagesFooter,
    PromptContainer
  },
  methods: {
    goToMapPage() {
      router.push('/map')
    },
    goToPromptPage() {
      router.push('/chatbot')
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

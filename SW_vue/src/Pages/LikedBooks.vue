<template>
  <PagesHeader />
  <h1 style="text-align: center; margin: 20px; font-size: 40px">나의 좋아요 목록</h1>
  <div class="book-list">
    <div class="liked-book" v-for="book in likedList" :key="book.isbn13">
      <img :src="book.cover" alt="책 이미지" />
      <h4>{{ book.title.split(/\(|-/)[0] }}</h4>
      <h4>{{ book.author.split('(지은이)')[0] }}</h4>
      <button class="deleteBtn" @click="deleteBook(book.ISBN13)" />
    </div>
  </div>
</template>
<script>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import PagesHeader from '@/components/Bar/PagesHeader.vue'

export default {
  components: {
    PagesHeader
  },
  setup() {
    const model = ref(null)
    const isLoggedIn = ref(false)
    const currentUser = ref(null)
    const likedList = ref([])
    const loading = ref(true)
    const error = ref(null)

    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://43.200.4.199:80/api/auth/status')
        const { isLoggedIn: loggedIn, currentUser: user } = response.data.authState
        isLoggedIn.value = loggedIn
        currentUser.value = user || null
      } catch (error) {
        console.error('인증 상태 확인 실패:', error)
      }
    }

    const fetchLiked = async () => {
      try {
        if (!currentUser.value || !currentUser.value.id) {
          throw new Error('사용자 ID가 존재하지 않습니다.')
        }

        const response = await axios.get(`http://43.200.4.199:80/api/books/liked/`)

        console.log(response)

        if (response.status === 200) {
          likedList.value = response.data.books
        } else {
          throw new Error(response.data.message || '좋아요한 목록을 가져오는 데 실패.')
        }
      } catch (error) {
        console.error('좋아요 목록을 불러오는 중 오류가 발생:', error)
        error.value = '좋아요 목록을 불러오는 중 오류가 발생했습니다.'
      } finally {
        loading.value = false
      }
    }

    const getHighResolutionImage = (url) => url.replace('coversum', 'cover')

    const handleImageClick = (link) => window.open(link)

    const deleteBook = async (isbn13) => {
      if (confirm('이 책을 정말 삭제하시겠습니까?')) {
        try {
          const response = await axios.delete(`http://43.200.4.199/api/books/unlike/${isbn13}`)
          console.log('좋아요 취소 응답:', response.data)

          likedList.value = likedList.value.filter((book) => book.ISBN13 !== isbn13)
        } catch (error) {
          console.error('책 삭제 중 오류 발생:', error)
          alert('책을 삭제하는 데 실패했습니다.')
        }
      }
    }
    watch(
      likedList,
      (newList, oldList) => {
        console.log('likedList가 변경되었습니다.')
        console.log('변경 전:', oldList)
        console.log('변경 후:', newList)
      },
      { deep: true } // 깊은 감시 (중첩된 객체/배열도 감시 가능)
    )

    onMounted(async () => {
      await checkAuthStatus()
      if (isLoggedIn.value) {
        await fetchLiked()
      }
    })

    return {
      model,
      isLoggedIn,
      currentUser,
      likedList,
      loading,
      error,
      getHighResolutionImage,
      handleImageClick,
      deleteBook
    }
  }
}
</script>
<style scoped>
.book-list {
  display: grid;
  grid-template-columns: repeat(3, 360px); /* 3열 레이아웃 */
  justify-items: center; /* 각 열의 아이템 중앙 정렬 */
  row-gap: 30px;
  column-gap: 5px;
  justify-content: center;
  margin-top: 30px;
}

.liked-book {
  position: relative;
  border: 0.2px solid gray;
  border-radius: 20px;
  width: 280px;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 4px 8px 4px gray;
}

.liked-book img {
  max-width: 200px;
  max-height: 250px;
  object-fit: contain;
  margin: 10px;
}

.liked-book h3:nth-of-type(1) {
  align-self: flex-start;
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}

.liked-book h3:nth-of-type(2) {
  align-self: flex-start;
  width: 100%;
  text-align: center;
}

.deleteBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background-color: transparent;
  background-image: url('@/assets/deleteIcon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>

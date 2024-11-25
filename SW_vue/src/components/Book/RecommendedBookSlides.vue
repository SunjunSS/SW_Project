<template>
  <div v-if="isLoggedIn" class="recommended-header">
    <h1 style="margin-bottom: 15px">
      <span class="user-name">{{ currentUser.name }}</span
      >님을 위한 추천 도서
    </h1>
    <!-- <h3 style="color: gray">&nbsp;</h3> -->
  </div>

  <v-sheet class="mx-auto" elevation="8">
    <v-slide-group v-model="model" class="pa-4" center-active="true" show-arrows>
      <v-slide-group-item v-for="book in recommend" :key="book.title" v-slot="{ selectedClass }">
        <v-card
          v-if="book.cover"
          :class="['ma-4', selectedClass]"
          :image="getHighResolutionImage(book.cover)"
          @click="handleImageClick(book.link)"
        >
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const model = ref(null)
    const isLoggedIn = ref(false)
    const currentUser = ref(null)
    const recommend = ref([])
    const loading = ref(true)
    const error = ref(null)

    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://43.200.4.199:80/api/auth/status')
        const { isLoggedIn: loggedIn, currentUser: user } = response.data.authState
        isLoggedIn.value = loggedIn
        currentUser.value = user || null

        console.log(currentUser.value) // currentUser가 제대로 초기화되어 있는지 확인

        console.log('Current User:', currentUser.value)
      } catch (error) {
        console.error('인증 상태 확인 실패:', error)
      }
    }

    const fetchRecommended = async () => {
      try {
        // !currentUser.value.id 사용자의 id가 존재하지 않음을 알 수 있다.

        if (!currentUser.value || !currentUser.value.id) {
          throw new Error('사용자 ID가 존재하지 않습니다.')
        }

        console.log(`${currentUser.value.id}`)

        // 에러 발생 지점 - userId는 잘전달된다... GET방식으로 보냄
        const response = await axios.get(
          `http://43.200.4.199:80/api/recommendations/${currentUser.value.id}`
        )

        // POST방식
        // const response = await axios.post('http://43.200.4.199:80/api/recommendations', {
        // userId: currentUser.value.id
        // });

        console.log(response)

        if (response.data.success) {
          recommend.value = response.data.recommendations
          console.log(recommend.value)
        } else {
          throw new Error(response.data.message || '추천 도서를 불러오는 데 실패했습니다.')
        }
      } catch (error) {
        console.error('추천 도서 API 요청 중 오류:', error)
        error.value = '추천 도서를 불러오는 중 오류가 발생했습니다.'
      } finally {
        loading.value = false
      }
    }

    const getHighResolutionImage = (url) => url.replace('coversum', 'cover')

    const handleImageClick = (link) => window.open(link)

    onMounted(async () => {
      await checkAuthStatus()
      if (isLoggedIn.value) {
        await fetchRecommended()
      }
    })

    return {
      model,
      isLoggedIn,
      currentUser,
      recommend,
      loading,
      error,
      getHighResolutionImage,
      handleImageClick
    }
  }
}
</script>

<style scoped>
.recommended-header {
  margin: 10px 0 0 15%;
}

.v-sheet {
  width: 70%;
  height: 352px;
  margin-top: 0.5rem;
}

.v-slide-group {
  height: 352px;
}

.v-slide-group-item {
  height: 316px;
}

.v-card {
  height: 90%;
  width: 200px;
  vertical-align: middle;
}

.book-cover {
  width: 90%;
  height: 90%;
  object-fit: cover;
  cursor: pointer;
}
</style>

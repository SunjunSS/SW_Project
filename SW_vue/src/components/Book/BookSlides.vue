<template>
  <div style="margin: 1rem 0 0 15%">
    <h1>이번 주 베스트셀러</h1>
    <h3 style="color: gray">Top 30</h3>
  </div>
  <v-sheet class="mx-auto" elevation="8">
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      center-active="true"
      show-arrows
    >
      <v-slide-group-item v-for="book in bestsellers" :key="book.isbn13" v-slot="{ selectedClass }">
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  data: () => ({
    model: null
  }),
  setup() {
    const bestsellers = ref([])
    const loading = ref(true)
    const error = ref(null)
    const fetchBestsellars = async () => {
      try {
        const response = await axios.get('/api/ItemList.aspx', {
          params: {
            ttbkey: 'ttbwowkmini0211001',
            QueryType: 'Bestseller',
            MaxResults: 30,
            start: 1,
            SearchTarget: 'Book',
            output: 'js',
            Version: '20131101'
          }
        })

        if (response.data && response.data.item) {
          bestsellers.value = response.data.item.map((book) => ({
            isbn13: book.isbn13,
            bestRank: book.bestRank,
            link: book.link,
            title: book.title,
            cover: book.cover
          }))
        } else {
          throw new Error('예상치 못한 API 응답 구조')
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error)
        error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
      } finally {
        loading.value = false
      }
    }
    const getHighResolutionImage = (url) => {
      // Replace 'coversum' with 'cover' in the URL to get a higher resolution image
      return url.replace('coversum', 'cover')
    }

    const handleImageClick = (link) => {
      window.open(link)
    }

    onMounted(fetchBestsellars)

    return { bestsellers, loading, error, getHighResolutionImage, handleImageClick }
  }
}
</script>
<style>
.v-sheet {
  width: 70%;
  height: 22rem;
  margin-top: 0.5rem;
}

.v-slide-group {
  height: 100%;
}

.v-slide-group-item {
  height: 90%;
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

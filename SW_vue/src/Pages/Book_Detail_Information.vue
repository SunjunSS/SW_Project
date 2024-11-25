<template>
  <PagesHeader />
  <div class="book-details-page">
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="container">
        <div class="book-info">
          <div class="book-header">
            <div class="book-cover-container">
              <img :src="bookDetails.cover" alt="책 이미지" class="book-cover" />
            </div>
            <div class="book-content">
              <h2>{{ bookDetails.title }}</h2>
              <button class="like-button" @click="toggleLike">
                <v-icon :icon="isLiked ? 'mdi-heart' : 'mdi-heart-outline'" class="heart-icon" />
              </button>
              <p class="original-title">원제목: {{ bookDetails.originalTitle }}</p>
              <div class="book-details">
                <p>
                  <strong><v-icon icon="mdi-star" class="starLank"></v-icon></strong>
                  <span class="review-rank">{{ bookDetails.customerReviewRank }}</span>
                </p>
                <p><strong>장르:</strong> {{ bookDetails.categoryName }}</p>
                <p><strong>저자:</strong> {{ bookDetails.author }}</p>
                <p><strong>ISBN:</strong> {{ bookDetails.isbn13 }}</p>
                <p><strong>페이지 수:</strong> {{ bookDetails.itemPage }}</p>
                <p><strong>출간일:</strong> {{ bookDetails.pubDate }}</p>
                <p><strong>출판사:</strong> {{ bookDetails.publisher }}</p>
              </div>
              <div class="book-pricing">
                <p class="price original">
                  정가: <span>{{ bookDetails.priceStandard }}원</span>
                </p>
                <p class="price discounted">
                  판매가: <span>{{ bookDetails.priceSales }}원</span>
                </p>
              </div>
              <div class="book-Link">
                <a :href="bookDetails.link" target="_blank">구매링크</a>
              </div>
            </div>
          </div>
          <div class="book-description">
            <h3>상품 설명</h3>
            <p>{{ bookDetails.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PagesHeader from '@/components/Bar/PagesHeader.vue'

export default {
  components: {
    PagesHeader
  },
  data() {
    return {
      bookDetails: {},
      loading: true,
      error: null,
      bookTitle: '',
      author: '',
      isLiked: false
    }
  },
  created() {
    this.fetchBookDetails()
  },
  methods: {
    async fetchBookDetails() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('http://43.200.4.199/api/book-title')
        this.bookTitle = response.data.title
        this.author = response.data.author

        const searchResponse = await axios.get('/api/ItemSearch.aspx', {
          params: {
            ttbkey: 'ttbzinzza1220952001',
            Query: `${this.bookTitle}+${this.author}`,
            QueryType: 'Keyword',
            MaxResults: 1,
            start: 1,
            SearchTarget: 'Book',
            output: 'js',
            Version: '20131101'
          }
        })

        if (
          searchResponse.data &&
          searchResponse.data.item &&
          searchResponse.data.item.length > 0
        ) {
          const itemId = searchResponse.data.item[0].itemId

          const detailResponse = await axios.get('/api/ItemLookUp.aspx', {
            params: {
              ttbkey: 'ttbzinzza1220952001',
              ItemId: itemId,
              ItemIdType: 'ItemId',
              output: 'js',
              Version: '20131101',
              OptResult: 'ebookList,usedList,reviewList'
            }
          })

          if (
            detailResponse.data &&
            detailResponse.data.item &&
            detailResponse.data.item.length > 0
          ) {
            const item = detailResponse.data.item[0]
            this.bookDetails = {
              title: item.title,
              originalTitle: item.subInfo.originalTitle,
              isbn13: item.isbn13,
              itemPage: item.subInfo?.itemPage || 'N/A',
              categoryName: item.categoryName,
              author: item.author,
              pubDate: item.pubDate,
              description: item.description,
              priceStandard: item.priceStandard,
              priceSales: item.priceSales,
              cover: this.getHighResolutionImage(item.cover),
              publisher: item.publisher,
              customerReviewRank: item.customerReviewRank,
              link: item.link
            }
            // 책 상세 정보를 가져온 후 좋아요 상태 확인
            await this.checkLikeStatus()
          } else {
            throw new Error('책 상세 정보를 찾을 수 없습니다.')
          }
        } else {
          throw new Error('검색 결과가 없습니다.')
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error)
        this.error = '데이터를 불러오는 중 오류가 발생했습니다: ' + error.message
      } finally {
        this.loading = false
      }
    },
    async toggleLike() {
      try {
        if (this.isLiked) {
          // 좋아요 취소
          const response = await axios.delete(
            `http://43.200.4.199/api/books/unlike/${this.bookDetails.isbn13}`
          )
          console.log('좋아요 취소 응답:', response.data)
          this.isLiked = false
        } else {
          // 좋아요 추가
          const data = {
            title: this.bookDetails.title,
            author: this.bookDetails.author,
            ISBN13: this.bookDetails.isbn13,
            genre: this.bookDetails.categoryName,
            price_standard: this.bookDetails.priceStandard,
            cover: this.bookDetails.cover,
            pricesales: this.bookDetails.priceSales
          }
          const response = await axios.post('http://43.200.4.199/api/books/like', data)
          console.log('좋아요 추가 응답:', response.data)
          this.isLiked = true
        }
      } catch (error) {
        console.error('좋아요 토글 중 오류:', error)
        // 에러 처리를 추가할 수 있습니다
      }
    },
    async checkLikeStatus() {
      try {
        const response = await axios.get(
          `http://43.200.4.199/api/books/like-status/${this.bookDetails.isbn13}`
        )
        this.isLiked = response.data.isLiked
      } catch (error) {
        console.error('좋아요 상태 확인 중 오류:', error)
      }
    },
    getHighResolutionImage(url) {
      return url.replace('coversum', 'cover')
    }
  }
}
</script>

<style scoped>
.like-button {
  background-color: transparent;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.heart-icon {
  color: red;
}

.like-button:active {
  background-color: red;
}

.like-button.is-liked {
  color: white;
}

.book-details-page {
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.book-header {
  display: flex;
  gap: 40px;
}

.book-cover-container {
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
}

.book-content {
  flex: 1;
}

h2 {
  color: #333;
}

.original-title {
  font-style: italic;
  color: #666;
}

.book-details p {
  color: #444;
}

.starLank {
  color: #ffe400 !important;
}

.price.original {
  color: #888;
}

.price.discounted {
  color: #e74c3c;
  font-weight: 700;
}

.book-description {
  border-top: 1px solid #eee;
}

.book-description h3 {
  color: #333;
}

.book-description p {
  color: #555;
  line-height: 1.6;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

/* Media Queries */
@media (max-width: 500px) {
  .container {
    padding: 15px;
  }

  .book-header {
    flex-direction: column;
  }

  .book-cover-container {
    width: 50vw;
    height: 43vh;
    margin: 0 auto;
  }

  h2 {
    font-size: 1.3rem;
  }

  .original-title {
    margin-bottom: 0.4rem;
  }

  .book-details p {
    margin: 0.3rem 0;
  }

  .book-description {
    margin-top: 2vh;
    padding-top: 2vh;
  }

  .book-description h3 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .book-details p,
  .book-description p {
    font-size: 0.9rem;
  }

  .book-pricing {
    margin: 0.4rem 0;
  }

  .price {
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .starLank {
    font-size: 1.4rem;
  }

  .review-rank {
    display: inline-block;
    transform: translate(0.1rem, 0.12rem);
  }

  .book-Link {
    font-size: 0.9rem;
  }
}

@media (min-width: 501px) and (max-width: 800px) {
  .container {
    padding: 20px;
  }

  .book-header {
    flex-direction: row;
  }

  .book-cover-container {
    width: 30vw;
    height: 43vh;
    margin: 0 auto;
  }

  h2 {
    font-size: 1.4rem;
  }

  .original-title {
    margin-bottom: 0.4rem;
  }

  .book-details p {
    margin: 0.3rem 0;
  }

  .book-description {
    margin-top: 2vh;
    padding-top: 2vh;
  }

  .book-description h3 {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }

  .book-details p,
  .book-description p {
    font-size: 0.8rem;
  }

  .book-pricing {
    margin: 0.3rem 0;
  }

  .price {
    font-size: 1rem;
    margin: 0.4rem 0;
  }

  .starLank {
    font-size: 1.3rem;
  }

  .review-rank {
    display: inline-block;
    transform: translate(0.1rem, 0.12rem);
  }

  .book-Link {
    font-size: 0.8rem;
  }
}

@media (min-width: 801px) {
  .container {
    padding: 30px;
  }

  .book-header {
    flex-direction: row;
  }

  .book-cover-container {
    width: 20vw;
    height: 55vh;
    margin: 0 auto;
  }

  h2 {
    font-size: 1.6rem;
  }

  .original-title {
    margin-bottom: 0.6rem;
  }

  .book-details p {
    margin: 0.5rem 0;
  }

  .book-description {
    margin-top: 4vh;
    padding-top: 3vh;
  }

  .book-description h3 {
    font-size: 1.15rem;
    margin-bottom: 0.4rem;
  }

  .book-details p,
  .book-description p {
    font-size: 1rem;
  }

  .book-pricing {
    margin: 0.5rem 0;
  }

  .price {
    font-size: 1.2rem;
    margin: 0.6rem 0;
  }

  .starLank {
    font-size: 1.6rem;
  }

  .review-rank {
    display: inline-block;
    transform: translate(0.2rem, 0.05rem);
  }

  .book-Link {
    font-size: 1rem;
  }
}
</style>

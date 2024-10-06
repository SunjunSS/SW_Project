<template>
    <div> 
      <div class="header">
        <transition name="image-transition" mode="out-in">
          <img @click="goToMainHome()"
            :key="currentImageIndex"
            :src="currentHeaderImage" 
            :class="{'header-image2': currentImageIndex === 1 }"
            alt="headerImage" 
            class="header-image"
          />
        </transition>
        <div class="SubFunction">
          <v-icon icon="mdi-account-box" class="Login"></v-icon>
          <v-icon icon="mdi-map-marker-radius" class="BookStoreLocation" @click="goToMapPage()"></v-icon>
        </div>
      </div>
    </div>
</template>

<script>
import router from '../router.js';

import headerImage from '@/assets/headerImage.png';
import headerImage2 from '@/assets/headerImage2.png';

export default {
  name: 'PagesHeader',
  data() {
    return {
      headerImages: [headerImage, headerImage2],
      currentImageIndex: 0
    };
  },
  computed: {
    currentHeaderImage() {
      return this.headerImages[this.currentImageIndex];
    }
  },
  mounted() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.headerImages.length;
    }, 5000);
  },
  methods: {
    goToMapPage() {
      router.push('/map');
    },
    goToMainHome(){
      router.push('/');  
    }
  }
};
</script>

<style>
.header {
  height: 80px;
  background-color: #FDF4E1 !important;
  display: flex;
  align-items: center;
  padding: 0;
}

.header-image {
  max-height: 60px;
  width: auto;
  margin-left: 150px;
}

.SubFunction{
  margin-left: auto; /* 오른쪽 정렬 */
  margin-right: 150px;
}

.Login{
  font-size: 45px !important;
  margin-right: 50px;
  color: #747474;
}

.BookStoreLocation{
  font-size: 40px !important;
  color: #B44806;
}

.header-image2 {
  max-height: 30px; /* headerImage2의 크기를 조절 */
  width: auto; /* 비율 유지 */
}

.image-transition-enter-active,
.image-transition-leave-active {
  transition: all 0.3s ease;
}

.image-transition-enter-from,
.image-transition-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.image-transition-enter-to,
.image-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
<template>
  <header class="header">
    <div class="header-content">
      <transition name="image-transition" mode="out-in">
        <img 
          @click="goToMainHome"
          :key="currentImageIndex"
          :src="currentHeaderImage" 
          :class="{'header-image-2': currentImageIndex === 1}"
          alt="Header Image" 
          class="header-image"
        />
      </transition>
      <div class="sub-function">
        <button class="icon-button" @click="goToLoginPage" aria-label="Login">
          <v-icon icon="mdi-account-arrow-right-outline" class="login-icon"></v-icon>
        </button>
        <button class="icon-button" @click="goToMapPage" aria-label="Bookstore Location">
          <v-icon icon="mdi-map-marker-radius-outline" class="location-icon"></v-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import router from '../../router.js';

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
    goToMainHome() {
      router.push('/');
    }
  }
};
</script>

<style scoped>
.header {
  background-color: #FDF4E1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-image {
  max-height: 60px;
  width: auto;
  transition: transform 0.3s ease;
}

.header-image:hover {
  transform: scale(1.15);
}

.header-image-2 {
  max-height: 30px;
}

.sub-function {
  display: flex;
  gap: 20px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(139, 69, 19, 0.2);
}

.icon-button:hover {
  background-color: rgba(139, 69, 19, 0.1);
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
}

.icon {
  transition: color 0.3s ease, transform 0.3s ease;
}

.login-icon {
  font-size: 45px !important;
  color: #CD853F;
}

.location-icon {
  font-size: 40px !important;
  color: #CD853F;
}

.icon-button:hover .icon {
  transform: scale(1.1);
}

.icon-button:hover .login-icon {
  color: #D2691E; /* 시에나 색상 */
}

.icon-button:hover .location-icon {
  color: #D2691E; /* 페루 색상 */
}

.image-transition-enter-active,
.image-transition-leave-active {
  transition: all 0.3s ease;
}

.image-transition-enter-from,
.image-transition-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.image-transition-enter-to,
.image-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
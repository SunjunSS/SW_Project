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
        <div v-if="isLoggedIn && currentUser" class="auth-section">
          <div class="user-section">
            <div class="welcome-message">
              <span class="user-name">{{ currentUser.name }}</span> 님 환영합니다!
            </div>
          </div>
          <button class="icon-button" @click="handleAuthAction" aria-label="Logout">
            <v-icon 
              icon="mdi-account-arrow-left-outline"
              class="login-icon logged-in"
            ></v-icon>
          </button>
        </div>
        <button v-else class="icon-button" @click="handleAuthAction" aria-label="Login">
          <v-icon 
            icon="mdi-account-arrow-right-outline"
            class="login-icon"
          ></v-icon>
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
import axios from 'axios';
import headerImage from '@/assets/headerImage.png';
import headerImage2 from '@/assets/headerImage2.png';

export default {
  name: 'PagesHeader',
  data() {
    return {
      headerImages: [headerImage, headerImage2],
      currentImageIndex: 0,
      isLoggedIn: false,
      currentUser: null
    };
  },
  computed: {
    currentHeaderImage() {
      return this.headerImages[this.currentImageIndex];
    }
  },
  async created() {
    await this.checkAuthStatus();
    if (this.isLoggedIn) {
      await this.fetchUserInfo();
    }
  },
  mounted() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.headerImages.length;
    }, 5000);

    setInterval(async () => {
      await this.checkAuthStatus();
      if (this.isLoggedIn && !this.currentUser) {
        await this.fetchUserInfo();
      }
    }, 30000);
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await axios.get('http://43.200.4.199/api/auth/status');
        this.isLoggedIn = response.data.authState.isLoggedIn;
        if (response.data.authState.currentUser) {
          this.currentUser = response.data.authState.currentUser;
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://43.200.4.199/api/login');
        if (response.data.user) {
          this.currentUser = response.data.user;
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    },
    async handleAuthAction() {
      if (this.isLoggedIn) {
        try {
          await axios.post('http://43.200.4.199/api/auth/logout');
          this.isLoggedIn = false;
          this.currentUser = null;
          router.push('/');
        } catch (error) {
          console.error('로그아웃 실패:', error);
        }
      } else {
        router.push('/login');
      }
    },
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
  align-items: center;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-section {
  background-color: rgba(139, 69, 19, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.welcome-message {
  color: #8B4513;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.user-name {
  font-weight: 700;
  color: #CD853F;
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

.login-icon {
  font-size: 45px !important;
  color: #CD853F;
  transition: color 0.3s ease;
}

.login-icon.logged-in {
  color: #8B4513;
}

.location-icon {
  font-size: 40px !important;
  color: #CD853F;
}

.icon-button:hover .login-icon,
.icon-button:hover .location-icon {
  color: #D2691E;
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
import { createRouter, createWebHistory } from 'vue-router'
import MainHome from './Pages/MainHome.vue'
import Map from './Pages/Map.vue'
import BookDetail from './Pages/Book_Detail_Information.vue'
import Prompt from './Pages/Prompt.vue'
import Register from './Pages/Register.vue'
import Login from './Pages/Login.vue' // Login.vue 경로 추가
import RealPrompt from './Pages/RealPrompt.vue'
import Chatbot from './Pages/Chatbot.vue'
const routes = [
  {
    path: '/',
    component: MainHome
  },
  {
    path: '/map',
    component: Map
  },
  {
    path: '/bookdetail',
    component: BookDetail
  },
  {
    path: '/prompt',
    component: Prompt
  },
  {
    path: '/register', // 회원가입 경로 추가
    component: Register // Register 컴포넌트 연결
  },
  {
    path: '/login', // 로그인 경로 추가
    component: Login // Login 컴포넌트 연결
  },
  {
    path: '/realPrompt', // 실제 프롬프트 추가
    component: RealPrompt // RealPrompt 컴포넌트 연결
  },
  {
    path: '/chatbot',
    component: Chatbot
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router';
import MainHome from "./components/MainHome/MainHome.vue";
import Test from "./Pages/Test.vue";

const routes = [
  {
      path: "/",
      component: MainHome,
  },
  {
      path: "/test",
      component: Test,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

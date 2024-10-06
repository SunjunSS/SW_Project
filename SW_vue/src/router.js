import { createRouter, createWebHistory } from 'vue-router';
import MainHome from "./components/MainHome/MainHome.vue";
import Map from "./Pages/Map.vue";

const routes = [
  {
      path: "/",
      component: MainHome,
  },
  {
      path: "/map",
      component: Map,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

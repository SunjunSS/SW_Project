import { createRouter, createWebHistory } from 'vue-router';
import MainHome from "./components/MainHome/MainHome.vue";
import Map from "./Pages/Map.vue";
import BookDetail from "./Pages/Book_Detail_Information.vue";

const routes = [
  {
      path: "/",
      component: MainHome,
  },
  {
      path: "/map",
      component: Map,
  },
  {
      path: "/bookdetail",
      component: BookDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

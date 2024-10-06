<template>
  <PagesHeader />
</template>

<script>
import router from '../../router.js';
import PagesHeader from '@/components/PagesHeader.vue';

export default {
  components: {
    PagesHeader, // Register the PagesHeader component
  },
  methods: {
    goToMapPage() {
      router.push('/map');
    }
  }
};
</script>

<style>
.btn {
  display: flex; /* 블록 레벨로 변경 */
  margin: 0 auto; /* 중앙 정렬 */
  width: 200px; /* 원하는 너비 설정 */
}
</style>

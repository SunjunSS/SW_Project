<template>
  <div class="footer">
    <span class="introduce">Developers</span>
    <div class="names">
      <span class="name">Kang Kyungmin</span>
      <span class="name">Kim Sunjun</span>
      <span class="name">Moon Kiup</span>
      <span class="name">Lee Heechan</span>
    </div>
  </div>
</template>

<style>
.footer {
  display: flex;
  width: 90%;
  height: 80px;
  margin: 60px auto 0;
  border-top: 1px solid gray;
  color: gray;
  font-weight: bolder;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 20px;
  margin-top: 150px;
}

.introduce {
  font-weight: bolder;
}

.names {
  display: flex;
  gap: 10px; /* 기본 간격을 줄입니다 */
}

.name {
  font-weight: lighter;
}

@media (max-width: 768px) {
  .names {
    gap: 8px; /* 화면이 줄어들면 간격을 더 줄입니다 */
  }
}

@media (max-width: 480px) {
  .names {
    gap: 4px; /* 작은 화면에서는 간격을 최소화합니다 */
  }
}
</style>

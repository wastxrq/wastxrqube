<template>
  <div class="page-section panel">
    <slot />
  </div>
</template>

<style scoped>
.page-section {
  padding: 36px 28px;
  margin-bottom: 20px;
}

@media (max-width: 560px) {
  .page-section {
    padding: 24px 18px;
  }
}
</style>

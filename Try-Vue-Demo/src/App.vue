<script setup></script>

<template>
  <transition name="fade" mode="out-in">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </transition>
</template>

<style scoped>
.fade-enter-active {
  transition: all 0.6s ease-out;
}
.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-active {
  transition: all 0.6s ease-out;
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<template>
  <div class="v-bg position-absolute top-0 right-0 left-0 bottom-0" style="z-index: 1;">
    <div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100"></div>
  </div>
</template>


<style scoped>
.v-bg {
  filter: blur(56px) brightness(0.6);
  pointer-events: none;
}

.v-bg>div {
  background: linear-gradient(to bottom right,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-error)));
  z-index: -10;
  clip-path: polygon(20% 50%, 27% 66%, 41% 66%, 50% 50%, 41% 34%, 27% 34%, 20% 50%, 55% 50%, 62% 66%, 76% 66%, 85% 50%, 76% 34%, 62% 34%, 55% 50%, 30% 50%, 37% 66%, 51% 66%, 60% 50%, 51% 34%, 37% 34%, 30% 50%);
}
</style>
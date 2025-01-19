<template>
    <div>
      <!-- Menu Desktop -->
      <nav class="desktop-nav" v-if="!navVisible">
        <ul class="d-flex">
          <li class="mr-2">
            <NuxtLink to="/" aria-label="Home page">Home</NuxtLink>
          </li>
          <li class="mr-2">
            <NuxtLink to="/skills" aria-label="Skills page">Skills</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/animation" aria-label="Animation page">Animation</NuxtLink>
          </li>
        </ul>
      </nav>
  
      <!-- Menu Mobile -->
      <v-navigation-drawer app :class="navVisible ? 'visible' : ''" class="d-flex flex-column" id="nav" :style="{ transform: navVisible ? 'translateX(0)' : 'translateX(-100%)' }" color="white" aria-label="Main navigation">
        <v-list role="listbox" aria-label="Navigation" class="d-flex flex-column align-center justify-center">
          <div class="line-top"></div>
          <v-list-item><NuxtLink to="/" aria-label="Home page">Home</NuxtLink></v-list-item>
          <v-list-item><NuxtLink to="/skills" aria-label="Skills page">Skills</NuxtLink></v-list-item>
          <v-list-item><NuxtLink to="/animation" aria-label="Animation page">Animation</NuxtLink></v-list-item>
          <div class="line-bottom"></div>
        </v-list>
      </v-navigation-drawer>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      navVisible: {
        type: Boolean,
        required: true
      }
    }
  };
  </script>
  
  <style>
.nav.visible {
  display: none;
} 

@media (max-width: 768px) {
.nav.visible {
  display: block;
}
.nav {
    display: block;  
  }
}

</style>
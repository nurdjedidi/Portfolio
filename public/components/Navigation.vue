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
  .icon-nav { 
    display: block;
  }

  .title { 
    display: flex;
    gap: 20px;
  }

.sidebar { 
display: block;
cursor: pointer;
z-index: 1001;
}

.nav {
    display: block;
    height: 100vh;
    width: 60vw;
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
}

.v-list {
    height: 100%;
    width: 50vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style-type: none;
}
.v-navigation-drawer * { 
    color: black;
}
.nav li { 
    margin: 10px; 
}
.nav a { 
    text-decoration: none;
}

.line-bottom { 
    height: 1px; 
    width: 40vw; 
    background-color: black; 
    margin-top: 20px;
}
.line-top { 
    height: 1px; 
    width: 40vw; 
    background-color: black; 
    margin-bottom: 20px;
}

@media (max-width: 768px) {
.sidebar { 
  display: block;
}

.icon {
  display: none;
}

.nav {
  display: none;
}

.nav.visible {
  display: block;
}

.sidebar {
  position: relative;
  margin-left: 0;
  z-index: 1001;
}

.desktop-nav {
  display: none;
}
}
}

</style>
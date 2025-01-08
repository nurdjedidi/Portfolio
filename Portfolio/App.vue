<template>
  <div class="app-layout">
    <header>
      <div class="title">
      <div id="ham" @click="toggleNav" class="sidebar">
    <div 
      v-for="(bar, index) in 3" 
      :key="index" 
      class="bar" 
      :style="{ backgroundColor: navVisible ? 'black' : 'white' }">
    </div>
  </div>
          <nav class="nav" id="nav" :class="{'visible': navVisible}">
            <ul>
          <li class="line-top"></li>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/skills">Skills</router-link></li>
          <li><router-link to="/animation">Animation</router-link></li> 
          <li class="line-bottom"></li>
        </ul>
          </nav>    
      <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M509.8 139.7l190.5 109.6 0.2 196.5 173.2 99.7 0.2 219.8-190.2 110.1-172.4-99.2-171.5 99.2-190.5-109.6-0.2-219.9 170.7-98.8-0.3-197.3z" fill="#FFFFFF"></path><path d="M520 527.5V365l-10 5.8-10-5.8v162.2l10.3 5.9zM339.5 666.9l-10-5.7v162.1l10.3 5.9 9.7-5.6V661.2zM693.4 823.6V661.2l-2 1.1c-1.6 0.9-3.3 1.3-5 1.3-3.5 0-6.8-1.8-8.7-5-2.5-4.3-1.4-9.6 2.2-12.7-3.8 1.4-6.6 5.1-6.6 9.4v167.9l10.3 5.9 9.8-5.5z" fill="#FFFFFF06F3FF"></path><path d="M825.1 563.7l8.4 4.8c-1.9-3.1-5.1-4.8-8.4-4.8zM833.7 568.9v9.5c1.6-2.9 1.7-6.5 0-9.5zM656.7 628.5l-8.7-5c-4.8-2.8-10.9-1.1-13.7 3.7-2.8 4.8-1.1 10.9 3.7 13.7l8.7 5c1.6 0.9 3.3 1.3 5 1.3 3.5 0 6.8-1.8 8.7-5 2.7-4.8 1.1-10.9-3.7-13.7zM613.3 603.6l-8.7-5c-4.8-2.8-10.9-1.1-13.7 3.7-2.8 4.8-1.1 10.9 3.7 13.7l8.7 5c1.6 0.9 3.3 1.3 5 1.3 3.5 0 6.8-1.8 8.7-5 2.8-4.8 1.1-10.9-3.7-13.7z" fill="#FFFFFF005BFF"></path><path d="M833.6 568.7c0-0.1-0.1-0.1-0.1-0.2l-8.4-4.8c-1.8 0-3.5 0.4-5.2 1.3l-8.7 5c-4.8 2.8-6.4 8.9-3.7 13.7 1.9 3.2 5.2 5 8.7 5 1.7 0 3.4-0.4 5-1.3l8.7-5c1.7-1 2.9-2.3 3.8-3.9V569c0-0.2-0.1-0.3-0.1-0.3zM690 640l-8.7 5c-0.5 0.3-1 0.6-1.4 1-3.7 3.1-4.7 8.4-2.2 12.7 1.9 3.2 5.2 5 8.7 5 1.7 0 3.4-0.4 5-1.3l2-1.1 6.7-3.9c4.8-2.8 6.4-8.9 3.7-13.7-2.9-4.8-9-6.5-13.8-3.7zM570 578.7l-8.7-5c-4.8-2.8-10.9-1.1-13.7 3.7-2.8 4.8-1.1 10.9 3.7 13.7l8.7 5c1.6 0.9 3.3 1.3 5 1.3 3.5 0 6.8-1.8 8.7-5 2.7-4.8 1-11-3.7-13.7zM776.6 590l-8.7 5c-4.8 2.8-6.4 8.9-3.7 13.7 1.9 3.2 5.2 5 8.7 5 1.7 0 3.4-0.4 5-1.3l8.7-5c4.8-2.8 6.4-8.9 3.7-13.7-2.8-4.8-8.9-6.5-13.7-3.7zM733.3 615l-8.7 5c-4.8 2.8-6.4 8.9-3.7 13.7 1.9 3.2 5.2 5 8.7 5 1.7 0 3.4-0.4 5-1.3l8.7-5c4.8-2.8 6.4-8.9 3.7-13.7-2.8-4.8-8.9-6.5-13.7-3.7z" fill="#FFFFFF005BFF"></path><path d="M873.7 545.5l-173.2-99.7-0.2-196.5-190.5-109.6-190.3 110.1 0.2 197.3L149 546l0.3 219.8 190.5 109.7 171.4-99.3 172.4 99.3 190.2-110.1-0.1-219.9zM509.8 185.9l140.4 80.8-140.3 81L369.5 267l140.3-81.1zM339.3 482l140.4 80.8-140.3 81L199 563.1 339.3 482z m10.2 341.6l-9.7 5.6-10.3-5.9-140.2-80.7-0.2-162.1 140.4 80.7 10 5.8 10-5.8 140.4-81 0.2 162.1-140.6 81.3z m160.8-290.5l-10.3-5.9-140.2-80.7-0.2-162.1L500 365l10 5.8 10-5.8 140.4-81 0.2 162.1L520 527.5l-9.7 5.6z m323.6 209.1l-140.6 81.4-9.7 5.6-10.3-5.9-140.2-80.7L533 569l150.3-87 141.9 81.7c3.3 0.1 6.6 1.8 8.4 4.8l0.2 0.1v0.3c1.7 3.1 1.6 6.7 0 9.5l0.1 163.8z" fill="#FFFFFF005BFF"></path></g></svg>
      <h1>Web Portfolio</h1>
      </div>
      <nav class="desktop-nav">
        <ul>
          <li><router-link to="/">Home</router-link></li> |
          <li><router-link to="/skills">Skills</router-link></li> |
          <li><router-link to="/animation">Animation</router-link></li> 
        </ul>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
  return {
    navVisible: false, 
  };
},
methods: {
  toggleNav() {
    this.navVisible = !this.navVisible; 
  },
},
};
</script>

<style>
.desktop-nav { 
  float: right;
}

.desktop-nav ul {
  display: flex;
  gap: 15px;
  list-style-type: none;
}


.sidebar { 
  display: none;
}

a { 
  list-style-type: none;
  text-decoration: none;
}

header {
display: flex;
align-items: center; 
justify-content: space-between;
padding: 0.5rem 1rem;
box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

header nav ul li a.router-link-active {
font-weight: bold;
color: blue;
}
.title { 
  display: flex;
}

.nav { 
  display: none;
}

.nav ul { 
  display: none;
}

.sidebar { 
  display: none;
}

@media (max-width: 768px) {

  .title { 
    display: flex;
    gap: 20px;
  }

.sidebar { 
display: block;
cursor: pointer;
z-index: 1001;
}

.bar {
width: 25px;
height: 3px;
background-color: white;
margin: 3px 0;
transition: 0.4s;
}

.nav {
    display: block;
    height: 100vh;
    width: 60vw;
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: white;
}

.nav ul {
    height: 100%;
    width: 30vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style-type: none;
}
.nav * { 
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

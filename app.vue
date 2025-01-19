<template>
  <v-app class="app-layout">
    <header>
      <v-container fluid class="title d-flex justify-space-between align-center" color="grey-darken-4">
    <div class="d-flex align-center">
      <v-icon icon="mdi-monitor" size="33" class="mr-2 d-none d-md-flex" aria-label="Desktop icon"></v-icon>
      <v-icon icon="mdi-menu"  :class="{'icon-active': navVisible}" class="mr-2 d-flex d-sm-none" aria-label="Menu" @click="toggleNav"></v-icon>
      <h1 class="mb-0">Web Portfolio</h1>
    </div>
    <Navigation :nav-visible="navVisible" @toggle-nav="toggleNav" />
  </v-container>
    </header>
    <main>
      <NuxtPage />
    </main>
  <v-footer
    class="footer"
    padless
    color="grey-darken-4"
  >
    <v-container fluid class="d-flex  align-center">
      <div id="triangle" class="d-none d-md-flex justify-center  mb-4">
        <svg
          id="Layer_1"
          data-name="Layer 1"
          version="1.1"
          viewBox="0 0 2000 2000"
        >
          <polygon
            class="cls-1"
            points="928 781 1021 951 784.5 1371.97 1618 1371.97 1530.32 1544 509 1539 928 781"
          ></polygon>
          <polygon
            class="cls-3"
            points="1618 1371.97 784.5 1371.97 874.93 1211 1346 1211 923.1 456 1110.06 456 1618 1371.97"
          ></polygon>
          <g id="Layer_2" data-name="Layer 2">
            <polygon
              class="cls-2"
              points="418 1372.74 509 1539 928 781 1162.32 1211 1346 1211 923.1 456 418 1372.74"
            ></polygon>
          </g>
        </svg>
      </div>
      <v-form @submit.prevent="sendMail" class="w-100" style="max-width: 600px; margin: 20px 15px;">
        <h3 class="text-center mb-4">Need a site? Contact me</h3>
        <v-text-field label="Name" name="name" v-model="form.name" aria-label="First name" class="w-100" required></v-text-field>
        <v-text-field label="Last Name" name="lastName" v-model="form.lastName" aria-label="Last name" class="w-100" required></v-text-field>
        <v-text-field label="Email" name="email" type="email" v-model="form.email" aria-label="Email address" class="w-100" required></v-text-field>
        <v-textarea label="Message" name="message" rows="5" v-model="form.message" aria-label="Content" class="w-100"required></v-textarea>
        <v-btn
          id="mail"
          type="submit"
          aria-label="Submit the contact form"
          class="ma-2"
          color="primary"
          block
        >
          Send
        </v-btn>
        <p class="white--text text-center mt-4">&copy; Nûr Djedidi 2024</p>
      </v-form>
    </v-container>
  </v-footer>
  </v-app>
</template>

<script>
import Navigation from './public/components/Navigation.vue';
import { ref } from 'vue';

export default {
  components: {
    Navigation
  },
  data() {
    return {
      form: {
        name: '',
        lastName: '',
        email: '',
        message: ''
      },
      status: null,
      statusMessage: ''
    };
  },
  methods: {
    async sendMail() {
      try {
        const response = await $fetch('/api/send-mail', {
          method: 'POST',
          body: this.form
        });

        if (response.status === 'success') {
          this.status = 'success';
          this.statusMessage = 'Votre message a été envoyé avec succès !';
          this.form = { name: '', lastName: '', email: '', message: '' };
          window.location.href = '/'; 
        } else {
          this.status = 'error';
          this.statusMessage = 'Une erreur est survenue lors de l\'envoi du message.';
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du mail:', error);
        this.status = 'error';
        this.statusMessage = 'Une erreur est survenue lors de l\'envoi du message.';
      }
    }
  }
};
</script>

<style>
.desktop-nav { 
  float: right;
}

.v-list-item.router-link-active {
    color: #007bff; 
    font-weight: bold; 
}

.desktop-nav ul {
  display: flex;
  gap: 15px;
  list-style-type: none;
}

.nav.visible {
  display: none;
}
.v-icon {
  position: relative; 
  z-index: 1100; 
  transition: color 0.3s ease;
}
.v-icon.icon-active {
  color: black; 
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

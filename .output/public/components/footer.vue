<template>
  <v-footer dark>
    <v-responsive>
      <v-container class=" d-flex flex-column ">
        <div class="pt-0 d-none d-md-flex">
          <v-list class="d-flex">
            <v-list-item class="mx-1" v-for="page in pages" :key="page.title" :to="page.link" nuxt>{{ page.title
            }}</v-list-item>
          </v-list>
        </div>
        <div>
          <v-btn v-for="icon in socialIcons" :key="icon.icon" :icon="icon.icon" :href="icon.link" target="_blank"
            class="mx-2" variant="text"></v-btn>
        </div>

        <div class="mt-2">
          &copy; {{ new Date().getFullYear() }} Nûr Djedidi. All rights reserved
        </div>
      </v-container>
    </v-responsive>
  </v-footer>
</template>

<script lang="ts" setup>
const pages = [
  { title: 'Home', link: '/' },
  { title: 'Services', link: '/services' },
  { title: 'Projects', link: '/projects' },
  { title: 'About', link: '/about' },
  { title: 'Contact', link: '/contact' }
];

const socialIcons = [
  { icon: 'mdi-code-tags', link: 'https://github.com/nurdjedidi' },
  { icon: 'mdi-github', link: 'https://www.codecademy.com/profiles/Nur_djedd' },
  { icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/nur-djedidi/' },
  { icon: 'mdi-twitter', link: 'https://x.com/DjedidiNur' },
];
</script>
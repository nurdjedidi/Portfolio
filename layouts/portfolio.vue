<template>
  <v-app>
    <v-app-bar class="d-sm-flex d-md-none" dark>
      <v-app-bar-nav-icon aria-haspopup="true" aria-label="button-menu" @click="drawer = !drawer" />

      <v-toolbar-title>Web Portfolio</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="isMounted" v-model="drawer" temporary app>
      <v-list role="listbox" dense>
        <v-list-item aria-label="navigations mobile" role="option" v-for="item in items" class="text--primary"
          :key="item.title" :prepend-icon="item.icon" :to="item.link" nuxt>
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="transparent" class=" position-absolute d-sm-none d-md-flex" flat>
      <div class="d-md-flex d-none ga-4 mx-auto">
        <v-btn v-for="item in items" :key="item.title" :to="item.link" :title="item.title" aria-label="Navigation web"
          class="text-none" nuxt>
          {{ item.title }}
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { shallowRef, onMounted } from 'vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const drawer = shallowRef(false)

const items = [
  { title: 'Services', icon: 'mdi-briefcase-outline', link: '/services' },
  { title: 'Projects', icon: 'mdi-file-code-outline', link: '/projects' },
  { title: 'About', icon: 'mdi-information-outline', link: '/about' },
  { title: 'Contact', icon: 'mdi-phone', link: '/contact' }
]
</script>

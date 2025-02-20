<template>
  <v-app>
    <v-app-bar class="d-sm-flex d-md-none" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title>My Portfolio</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-if="isMounted" v-model="drawer" color="white" class="mt-6" temporary app>
      <v-list dense>
        <div class="mx-auto mb-5 bg-black" style="width: 40vw; height: 1px;" color="black"></div>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-title class="text--primary">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
        <div class="mx-auto mt-5 bg-black" style="width: 40vw; height: 1px;" color="black"></div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="transparent" class=" position-absolute d-sm-none d-md-flex" flat>
      <div class="d-md-flex d-none ga-4 mx-auto">
        <v-btn v-for="item in items" :key="item.title" class="text-none">
          <NuxtLink :to="item.link" :title="item.title" nuxt>{{ item.title }}</NuxtLink>
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
  { title: 'Services', link: '/services' },
  { title: 'Projects', link: '/projects' },
  { title: 'About', link: '/about' },
  { title: 'Contact', link: '/contact' }
]
</script>

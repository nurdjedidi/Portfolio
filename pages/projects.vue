<template>
  <v-app>
    <Background />
    <v-main>
      <v-container class="pa-sm-6 pa-md-12" fluid>
        <v-responsive class="text-center mx-auto my-10" max-width="700">

          <p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4">
            What to expect
          </p>

          <p class="mt-4 text-body-1 text-medium-emphasis">
            Below you'll find a list of some of the projects I've completed.
            Please note that, for the moment,
            these are only personal projects and therefore not functional.
          </p>
        </v-responsive>

        <v-responsive class="mx-auto" width="100%">
          <Projects />
        </v-responsive>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script lang="ts" setup>
import Background from '~/public/components/background.vue';
import Footer from '~/public/components/footer.vue';
import Projects from '~/public/components/Projects.vue';
</script>
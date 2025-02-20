<template>
  <v-app>
    <Background />
    <v-main>
      <v-container class="pa-sm-4 pa-md-12" fluid>
        <v-responsive class="text-center mx-auto" max-width="700">

          <p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4">
            Everything you need to build a great buisness.
          </p>

          <p class="mt-4 text-body-1 text-medium-emphasis">
            If you don't have a website or your search engine rankings are non-existent,
            let me build you a site that will boost your business,
            combined with SEO for ubiquitous search rankings.
          </p>
        </v-responsive>

        <v-row class="mt-8">
          <v-col v-for="(service, i) in services" :key="i" class="d-flex" md="6" cols="12">
            <v-responsive class="mx-auto" max-width="500" width="100%">
              <v-card>
                <a :href="service.link" target="_blank" calt="Services">
                  <v-img class="rounded-lg" :src="service.img"></v-img>
                </a>
              </v-card>
            </v-responsive>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script lang="ts" setup>
import Background from '~/public/components/background.vue';
import Footer from '~/public/components/footer.vue';

const services = [
  { title: 'Full stack website', img: '/images/nurdjedd.avif', link: 'https://www.fiverr.com/nurdjedd/do-full-stack-website-for-you' },
  { title: 'On page and technical SEO optimization', img: '/images/seo.avif', link: 'https://www.fiverr.com/nurdjedd/optimise-the-seo-of-your-website' }
]

</script>

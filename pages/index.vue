<template>
  <v-app>
    <v-main :min-height="$vuetify.display.mdAndUp ? 800 : 550">
      <v-container class="h-100 d-flex align-center justify-center">
        <div class="w-100 w-md-50 text-center">

          <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
            Boost your online presence with tailor-made development.
          </h1>

          <div class="text-body-1 text-medium-emphasis mb-10">
            Get your business off the ground with web design and SEO expertise tailored to your needs.
          </div>

          <div class="d-flex ga-4 justify-center">
            <v-btn class="text-none" color="primary" flat rounded="lg" text="Get started" to="/contact" nuxt />

            <v-btn append-icon="mdi-chevron-right" class="text-none" flat rounded="lg" text="Learn more" to="/services"
              nuxt />
          </div>
        </div>

        <div class="v-bg position-absolute top-0 right-0 left-0 bottom-0">
          <div aria-hidden="true" class="overflow-hidden opacity-20 w-100 h-100"></div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<style scoped>
.v-bg {
  filter: blur(56px);
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

<template>
  <v-app>
    <Background />
    <v-main>
      <Background />
      <v-container class="pa-6 pa-md-12" fluid>
        <p class="font-weight-bold text-h4 text-center">
          Contact
        </p>

        <p class="mt-2 text-subtitle-1 text-medium-emphasis mb-8 text-center">
          Do you need a website or advanced SEO ? Contact me.
        </p>
        <v-responsive v-model="form" class="mx-auto" max-width="600">
          <v-row :no-gutters="$vuetify.display.xs">
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.firstName" color="primary" density="compact" label="First Name"
                placeholder="John" required variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.lastName" color="primary" density="compact" label="Last Name"
                placeholder="Doe" required variant="outlined" />
            </v-col>
          </v-row>

          <v-text-field v-model="form.email" color="primary" density="compact" label="Email"
            placeholder="johndoe@gmail.com" variant="outlined" />

          <v-text-field v-model="form.industry" color="primary" density="compact" label="Industry" placeholder="Tech"
            variant="outlined" />

          <v-textarea v-model="form.message" color="primary" density="compact" label="Message" variant="outlined" />

          <v-btn class="text-none" color="primary" size="x-large" text="Let's talk" variant="flat" width="100%"
            @click="sendMail" />
        </v-responsive>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script lang="ts" setup>
import Background from '~/public/components/background.vue';
import Footer from '~/public/components/footer.vue';
import { ref } from 'vue';

const form = ref({
  firstName: '',
  lastName: '',
  industry: '',
  email: '',
  message: ''
});

const sendMail = async () => {
  try {
    const response = await $fetch('/api/send-mail', {
      method: 'POST',
      body: form.value
    });

    if (response.status === 'success') {
      form.value = { firstName: '', lastName: '', industry: '', email: '', message: '' };
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du mail:', error);
  }
};
</script>
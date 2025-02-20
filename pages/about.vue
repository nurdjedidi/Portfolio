<template>
  <v-app>
    <Background />
    <v-main>
      <v-container class="pa-sm-6 pa-md-12" fluid>
        <v-responsive class="text-center mx-auto my-10" max-width="700">

          <p id="services" class="mt-2 text-h5 font-weight-bold text-md-h4">
            What about my skills
          </p>

          <p class="mt-4 text-body-1 text-medium-emphasis">
            Passionate about web development, over the years I've acquired a diverse set of skills,
            combining technical rigour and creativity. From mastering modern frameworks to designing intuitive
            interfaces, I
            transform ideas into high-performance, elegant digital solutions.
          </p>

        </v-responsive>

        <v-responsive class="mx-auto" width="75%">
          <canvas id="myChart"></canvas>
        </v-responsive>

      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import Background from '~/public/components/background.vue';
import Footer from '~/public/components/footer.vue';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

onMounted(() => {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Nuxt.js', 'Vue.js', 'Typescript', 'Node.js', 'MySQL', 'API', 'SEO'],
      datasets: [
        {
          label: 'Maîtrise 1',
          data: [500, 480, 420, 390, 360, 330, 300],
          backgroundColor: [
            '#003366',
            '#004c99',
            '#0066cc',
            '#007aff',
            '#66b3ff',
            '#99ccff',
            '#e6f7ff'
          ],
          borderColor: '#fff',
          borderWidth: 0.5,
          hoverBorderWidth: 2,
          hoverOffset: 5
        },
      ]
    },
    options: {
      layout: {
        padding: {
          right: 20
        }
      },
      plugins: {
        tooltip: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'right',
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
});
</script>
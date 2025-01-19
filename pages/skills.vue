<template>
    <section class="skills d-flex justify-center align-center">
      <v-card class="card-learn" max-width="500" color="grey-darken-4">
      <v-card-title class="headline">Achievements</v-card-title>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card-subtitle>
            <v-icon icon="mdi-school" left></v-icon>
            Learning
          </v-card-subtitle>
          <v-card-text>
            <v-icon icon="mdi-calendar-check" left></v-icon> 1 year
          </v-card-text>
          <v-card-text>
            <v-icon icon="mdi-code-tags" left></v-icon> Full-Stack Developer
          </v-card-text>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card-subtitle>
            <v-icon icon="mdi-briefcase" left></v-icon>
            Professional
          </v-card-subtitle>
          <v-card-text>
            <v-icon icon="mdi-calendar-check" left></v-icon> < 1 year
          </v-card-text>
          <v-card-text>
            <v-icon icon="mdi-code-tags" left></v-icon> Full-Stack Developer
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
        <v-container class="chart-container" style="position: relative; height:40vh; width:80vw">
    <canvas id="myChart"></canvas>
        </v-container>
    </section>
  </template>

 <script>
 import { ref, onMounted } from 'vue';
 import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

 
 export default {
   name: 'Skills',
   setup() {
     onMounted(() => {
       const learn = document.getElementById('learn');
       const ctx = document.getElementById('myChart').getContext('2d');
       new Chart(ctx, {
        type: 'doughnut', 
        data: {
    labels: ['HTML', 'CSS', 'JS', 'Vue.js', 'Node.js', 'MySQL', 'MongoDB', 'API', 'SEO'],
    datasets: [
        {
            label: 'Maîtrise 1',
            data: [100, 95, 90, 85, 85, 70, 60, 80, 90],
            backgroundColor: [
                '#003366', 
                '#004c99', 
                '#0066cc', 
                '#007fff', 
                '#3399ff', 
                '#66b2ff', 
                '#99ccff', 
                '#cce5ff', 
                '#e6f7ff'  
            ],
            borderColor: '#fff',
            borderWidth: 0.5
        },
    ]
},
        options: {
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
   }
 };
 </script>

 <style>

.card-learn { 
  width: 100%;
}
@media (max-width: 768px) { 
  .skills {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }

  .chart-container {
    width: 100%; 
    margin-top: 40px; 
  }
}

 </style>
 
 
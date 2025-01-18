<template>
    <div>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(projects, index) in projects" :key="index">
          <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
            <v-img :src="projects.img" loading="lazy" :alt="projects.title" class="card-image"></v-img>
            <v-card-text class="card-content d-flex flex-column flex-grow-1">
              <h2 class="card-title">{{ projects.title }}</h2>
              <p class="card-description">{{ projects.description }}</p>
              <v-chip-group class="card-skill d-flex flex-wrap" column>
                <v-chip v-for="(skill, skillIndex) in projects.skills" :key="skillIndex" :prepend-icon="skill.icon" class="skill">{{ skill.name }}</v-chip>
              </v-chip-group>
              <a :href="projects.link" class="card-link mt-auto">See the projects</a>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>

  <script>
  export default { 
    name: 'Projects',
    data() { 
        return {
            projects: [ 
        { img :'../images/urbanstyle.avif', 
          title: 'Urbanstyle', 
          description: 'Below is the link to a fictitious online shop that I designed.',
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'JavaScript', icon: 'mdi-language-javascript' },
            { name: 'Node.js', icon: 'mdi-nodejs' }
          ],
          link: '../src/ext/Urbanstyle/accueil.html'
        },
        { img :'../images/news.avif', 
          title: 'World news', 
          description: 'Below is a link to see the latest news in your country.', 
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'JavaScript', icon: 'mdi-language-javascript' },
            { name: 'Node.js', icon: 'mdi-nodejs' }
          ],
          link: '../src/ext/World/news.html'
        },
        { img :'../images/fitness.avif', 
          title: 'Health & fitness (prototype)', 
          description: 'Below is the link to a fitness and health monitoring project.', 
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'JavaScript', icon: 'mdi-language-javascript' },
            { name: 'Node.js', icon: 'mdi-nodejs' }
          ],
          link: '#'
        }
      ]
        }
    }
  }
    </script>
<template>
  <div>
    <!-- Projects -->
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="(projects, index) in projects" :key="index">
        <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
          <v-img height="200px" width="100%" :src="projects.img" loading="lazy" :alt="projects.title"
            class="card-image">
          </v-img>
          <v-card-text class="card-content d-flex flex-column flex-grow-1">
            <h2 class="card-title">{{ projects.title }}</h2>
            <p class="card-description">{{ projects.description }}</p>
            <v-chip-group class="card-skill d-flex flex-wrap" column>
              <v-chip v-for="(skill, skillIndex) in projects.skills" :key="skillIndex" :prepend-icon="skill.icon"
                class="d-flex">{{ skill.name }}</v-chip>
            </v-chip-group>
            <a :href="projects.link" target="_blank" class="card-link mt-auto">See the projects</a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import news from '../images/news.avif';
import fitness from '../images/portfolio-nutriweb.avif';

export default {
  name: 'Projects',
  data() {
    return {
      projects: [
        {
          img: 'https://placehold.co/600x400?text=?',
          title: 'Devroid',
          description: 'SaaS will be available soon !',
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'Typescript', icon: 'mdi-language-typescript' },
            { name: 'Vue.js', icon: 'mdi-vuejs' },
            { name: 'Nuxt.js', icon: 'mdi-nuxt' },
            { name: 'Node.js', icon: 'mdi-nodejs' },
            { name: 'MySQL', icon: 'mdi-database-outline' },
          ],
          link: 'https://urbanstyle-mvwkc.ondigitalocean.app/'
        },
        {
          img: news,
          title: 'World news',
          description: 'Below is a link to see the latest news in your country.',
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'Vue.js', icon: 'mdi-vuejs' },
            { name: 'Node.js', icon: 'mdi-nodejs' },
            { name: 'API', icon: 'mdi-access-point' }
          ],
          link: '/news'
        },
        {
          img: fitness,
          title: 'NutriWeb (prototype)',
          description: 'Below is the link to a fitness and health monitoring project.',
          skills: [
            { name: 'HTML', icon: 'mdi-language-html5' },
            { name: 'CSS', icon: 'mdi-language-css3' },
            { name: 'Vue.js', icon: 'mdi-vuejs' },
            { name: 'Vuetify', icon: 'mdi-vuetify' },
            { name: 'Nuxt.js', icon: 'mdi-nuxt' },
            { name: 'Node.js', icon: 'mdi-nodejs' },
            { name: 'MySQL', icon: 'mdi-database' },
            { name: 'API', icon: 'mdi-access-point' }
          ],
          link: 'https://softai.info'
        }
      ]
    }
  }
}
</script>

<style>
.presentation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profil-img {
  width: 100%;
  max-width: 400px;
  height: auto;
}


.hover-transition {
  transition: transform 0.3s ease-in-out;
}

.hover-transition:hover {
  transform: scale(1..01)
}

section {
  margin: 50px;
  padding: 20px;
  max-width: 1200px;
  text-align: center;
}

.projets {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 10px;
}

p {
  font-size: 1.1em;
  color: #bbb;
  margin-bottom: 30px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  font-size: 1em;
  margin-bottom: 15px;
}

.card-skill {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.card-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0056b3;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.card-link:hover {
  background-color: #003f88;
}

@media (max-width: 768px) {
  .presentation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
  }

  section {
    margin: 0;
    padding: 20px;
  }

  .projets {
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  .card-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card {
    width: 100%;
    padding: 0;
  }

  .card-image {
    height: 180px;
  }

  .card-title {
    font-size: 1.4em;
  }

  .card-description {
    font-size: 1em;
  }

  .card-skill {
    flex-direction: row;
    justify-content: center;
  }

  .skill {
    font-size: 0.8em;
    padding: 3px 8px;
  }

  .card-link {
    font-size: 1em;
    padding: 8px 18px;
  }
}
</style>
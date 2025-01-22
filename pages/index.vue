<template>
    <section class="presentation">
      <v-card max-width="400px" class="d-flex flex-column justify-center hover-transition w-100" xs="w-20" sm="w-70" md="w-100" color="grey-darken-4">
      <nuxt-img
        src="/Vignette.avif"
        alt="Création de votre site web de A a Z"
        class="profil-img"
        eager
      ></nuxt-img>  
      <v-card-title>Nûr Djedidi</v-card-title>
      <v-card-subtitle>Full stack web developer</v-card-subtitle>
      <v-card-text>
        <v-row class="align-center" no-gutters>
            <v-col v-for="(social, index) in socialLinks" :key="index" class="d-flex justify-center">
              <v-icon :icon="social.icon" role="button" :aria-label="'View ' + social.name + ' profile'" @click="redirectTo(social.link)"></v-icon>
              <v-tooltip :key="'tooltip' + index" :activator="'parent'" location="bottom" :aria-label="'View ' + social.name + ' profile'">{{ social.name }}</v-tooltip>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
    </section>
   <v-container>
  <v-row>
    <v-col>
      <h2 class="projets">Projects</h2>
      <p>Below is a selection of some of the most complex projects I've done:</p>
    </v-col>
  </v-row>
  <section>
    <Projects />
  </section>
</v-container>

  </template>
  
  <script>
  import Projects from '../public/components/Projects.vue';
  export default {
    components: {
    Projects
  },
    name: 'Home',
    data() {
    return {
      socialLinks: [
        { name: 'Twitter', icon: 'mdi-twitter', link: 'https://twitter.com' },
        { name: 'Codecademy', icon: 'mdi-code-tags', link: 'https://www.codecademy.com' },
        { name: 'GitHub', icon: 'mdi-github', link: 'https://github.com' },
        { name: 'LinkedIn', icon: 'mdi-linkedin', link: 'https://www.linkedin.com' }
      ],
    };
  },
    methods: { 
      redirectTo(link) {
      window.open(link, '_blank');
    }
    }
  };
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
  margin: 50px ;
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
  
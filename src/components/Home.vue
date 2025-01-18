<template>
    <section class="presentation">
      <v-card max-width="400px" class="d-flex flex-column justify-center hover-transition w-100" xs="w-20" sm="w-70" md="w-100" color="grey-darken-4">
      <v-img 
        src="../images/Vignette.avif"
        alt="Création de votre site web de A a Z"
        class="profil-img"
        eager
      ></v-img>  
      <v-card-title>Nûr Djedidi</v-card-title>
      <v-card-subtitle>Full stack web developer</v-card-subtitle>
      <v-card-text>
        <v-row class="align-center" no-gutters>
            <v-col v-for="(social, index) in socialLinks" :key="index" class="d-flex justify-center">
              <v-icon :icon="social.icon" role="button" :aria-label="'View ' + social.name + ' profile'" @click="redirectTo(social.link)"></v-icon>
              <v-tooltip :activator="'parent'" location="bottom" :aria-label="'View ' + social.name + ' profile'">{{ social.name }}</v-tooltip>
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
  <v-row class="gap-4">
    <v-col v-for="(projects, index) in projects" :key="index" cols="12" sm="6" md="4">
      <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
        <v-img src="../images/urbanstyle.avif" :src="projects.img" loading="lazy" alt="Urbanstyle" class="card-image"></v-img>
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
</v-container>

  </template>
  
  <script>
  export default {
    name: 'Home',
    data() {
    return {
      socialLinks: [
        { name: 'Twitter', icon: 'mdi-twitter', link: 'https://twitter.com' },
        { name: 'Codecademy', icon: 'mdi-code-tags', link: 'https://www.codecademy.com' },
        { name: 'GitHub', icon: 'mdi-github', link: 'https://github.com' },
        { name: 'LinkedIn', icon: 'mdi-linkedin', link: 'https://www.linkedin.com' }
      ],
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

.skill {
  font-size: 0.9em;
  padding: 5px 10px;
  background-color: #f1f1f1;
  border-radius: 20px;
  color: #555;
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
  
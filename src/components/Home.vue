<template>
    <section class="presentation">
      <v-card max-width="400px" class="d-flex flex-column justify-center hover-transition w-100" xs="w-20" sm="w-70" md="w-100" color="grey-darken-4">
      <v-img 
        src="../images/Vignette.avif"
        class="profil-img w-100 h-100"
      ></v-img>  
      <v-card-title>Nûr Djedidi</v-card-title>
      <v-card-subtitle>Full stack web developer</v-card-subtitle>
      <v-card-text>
        <v-row class="align-center" no-gutters>
          <v-col>
            <v-icon icon="mdi-twitter" @click="twitter"></v-icon>
            <v-tooltip activator="parent" location="bottom">Twitter</v-tooltip>
          </v-col>
          <v-col>
            <v-icon icon="mdi-code-tags" @click="codecademy"></v-icon>
            <v-tooltip activator="parent" location="bottom">Codecademy</v-tooltip>
          </v-col>
          <v-col>
            <v-icon icon="mdi-github" @click="github"></v-icon>
            <v-tooltip activator="parent" location="bottom">Github</v-tooltip>
          </v-col>
          <v-col>
            <v-icon icon="mdi-linkedin" @click="linkedin"></v-icon>
            <v-tooltip activator="parent" location="bottom">Linkedin</v-tooltip>
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
    <v-col cols="12" sm="6" md="4">
      <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
        <v-img src="../images/urbanstyle.avif" loading="lazy" alt="Urbanstyle" class="card-image"></v-img>
        <v-card-text class="card-content d-flex flex-column flex-grow-1">
          <h2 class="card-title">Urbanstyle</h2>
          <p class="card-description">Below is the link to a fictitious online shop that I designed.</p>
          <v-chip-group class="card-skill d-flex flex-wrap" column>
            <v-chip prepend-icon="mdi-language-html5" class="skill">HTML</v-chip>
            <v-chip prepend-icon="mdi-language-css3" class="skill">CSS</v-chip>
            <v-chip prepend-icon="mdi-language-javascript" class="skill">JavaScript</v-chip>
            <v-chip prepend-icon="mdi-nodejs" class="skill">Node.js</v-chip>
          </v-chip-group>
          <a href="../src/ext/Urbanstyle/accueil.html" class="card-link mt-auto">See the projects</a>
        </v-card-text>
      </v-card>
    </v-col cols="12" sm="6" md="4">
    <v-col>
      <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
        <v-img src="../images/news.avif" loading="lazy" alt="World news" class="card-image"></v-img>
        <v-card-text class="card-content d-flex flex-column flex-grow-1">
          <h2 class="card-title">World news</h2>
          <p class="card-description">Below is a link to see the latest news in your country.</p>
          <v-chip-group class="card-skill d-flex flex-wrap" column>
            <v-chip prepend-icon="mdi-language-html5" class="skill">HTML</v-chip>
            <v-chip prepend-icon="mdi-language-css3" class="skill">CSS</v-chip>
            <v-chip prepend-icon="mdi-language-javascript" class="skill">JavaScript</v-chip>
            <v-chip prepend-icon="mdi-vuejs" class="skill">Vue.js</v-chip>
            <v-chip prepend-icon="mdi-nodejs" class="skill">Node.js</v-chip>
            <v-chip prepend-icon="mdi-access-point" class="skill">API</v-chip>
          </v-chip-group>
          <a href="../src/ext/World/news.html" class="card-link mt-auto">See the projects</a>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="4">
      <v-card rounded="lg" color="#FFFFFF00" class="border-thin d-flex flex-column hover-transition">
        <v-img src="../images/fitness.avif" loading="lazy" alt="Health & fitness" class="card-image"></v-img>
        <v-card-text class="card-content d-flex flex-column flex-grow-1">
          <h2 class="card-title">Health & fitness (prototype)</h2>
          <p class="card-description">Below is the link to a fitness and health monitoring project.</p>
          <v-chip-group class="card-skill d-flex flex-wrap" column>
            <v-chip prepend-icon="mdi-language-html5" class="skill">HTML</v-chip>
            <v-chip prepend-icon="mdi-language-css3" class="skill">CSS</v-chip>
            <v-chip prepend-icon="mdi-vuejs" class="skill">Vue.js</v-chip>
            <v-chip prepend-icon="mdi-nodejs" class="skill">Node.js</v-chip>
            <v-chip prepend-icon="mdi-database" class="skill">MySQL</v-chip>
            <v-chip prepend-icon="mdi-access-point" class="skill">API</v-chip>
          </v-chip-group>
          <a href="#" class="card-link mt-auto">See the projects</a>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>

  </template>
  
  <script>
  export default {
    name: 'Home',
    methods: { 
      twitter () { 
        const url = "https://x.com/DjedidiNur";
        window.open(url, "_blank");
      },
      codecademy () { 
        const url = "https://www.codecademy.com/profiles/Nur_djedd";
        window.open(url, "_blank");
      },
      github () { 
        const url = "https://github.com/nurdjedidi";
        window.open(url, "_blank");
      },
      linkedin () { 
        const url = "https://www.linkedin.com/in/n%C3%BBr-djedidi-829921236";
        window.open(url, "_blank");
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
  color: #555;
  margin-bottom: 30px;
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
}
  </style>
  
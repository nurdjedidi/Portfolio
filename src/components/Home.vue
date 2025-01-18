<template>
    <section class="presentation">
      <v-card max-width="400px" class="d-flex flex-column justify-center hover-transition w-100" xs="w-20" sm="w-70" md="w-100" color="grey-darken-4">
      <v-img 
        src="../images/Vignette.avif"
        class="profil-img"
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
  .card-client {
    background: #282828;
    width: 15vw;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    margin-top: 20px;
    border: 1px solid white;
    box-shadow: 0 6px 10px rgba(207, 212, 222, 0.3);
    border-radius: 10px;
    text-align: center;
    color: #fff;
    font-family: "Poppins", sans-serif;
    transition: all 0.3s ease;
  }
  
  .card-client:hover {
    transform: translateY(-10px);
  }
  
  .user-picture {
    overflow: hidden;
    object-fit: cover;
    width: 5rem;
    height: 5rem;
    border: 3px solid white;
    background-size: cover;
    border-radius: 999px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  
  .user-picture img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center; 
  }
  .name-client {
    margin: 0;
    margin-top: 20px;
    font-weight: 600;
    font-size: 18px;
    color: white;
  }
  .hover-transition {
  transition: transform 0.3s ease-in-out;
}

.hover-transition:hover {
  transform: scale(1..01)
}
  .name-client span {
    display: block;
    font-weight: 200;
    font-size: 16px;
  }
  
  .social-media:before {
    content: " ";
    display: block;
    width: 100%;
    height: 2px;
    margin: 20px 0;
    background: white;
  }
  
  .social-media a {
    position: relative;
    margin-right: 15px;
    text-decoration: none;
    color: inherit;
  }
  
  .social-media a:last-child {
    margin-right: 0;
  }
  
  .social-media a svg {
    width: 1.1rem;
    fill: currentColor;
  }
  
  .tooltip-social {
    background: #262626;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    padding: 0.5rem 0.4rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0;
    transform: translate(-50%, -90%);
    transition: all 0.2s ease;
    z-index: 1;
  }
  
  .tooltip-social:after {
    content: " ";
    position: absolute;
    bottom: 1px;
    left: 50%;
    border: solid;
    border-width: 10px 10px 0 10px;
    border-color: transparent;
    transform: translate(-50%, 100%);
  }
  
  .social-media a .tooltip-social:after {
    border-top-color: #262626;
  }
  
  .social-media a:hover .tooltip-social {
    opacity: 1;
    transform: translate(-50%, -130%);
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

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card {
  border: thin solid #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
  color: #777;
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
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.card-link:hover {
  background-color: #2980b9;
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

  .card-client {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin: 10px 0; 
  }

  .user-picture {
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
  }

  .name-client {
    font-size: 16px; 
  }

  .social-media {
    margin-top: 15px;
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

  .social-media a svg {
    width: 1.5rem; 
  }


  .social-media {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
  </style>
  
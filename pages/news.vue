<template>
    <main id="app">
        <div v-if="loading" class="load"></div>
        <section v-if="!loading" class="news-container">
            <div v-for="(news, index) in news" :key="index" class="news">
                <img :src="news.image" alt="Image de l'article"/>
                <p>{{ news.author }}</p>
                <p>{{ news.description }}</p>
                <button class="btn-view"><a :href="news.url" target="_blank">Learn more</a></button>
            </div>
        </section>             
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const news = ref([]);
const loading = ref(true);

const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');  
    const data = await response.json();         
    console.log(data);
    news.value = data.news;                    
  } catch (error) {
    console.error("Erreur système:", error);    
  } finally {
    loading.value = false;                      
  }
};

onMounted(() => {
  fetchNews();
});
</script>

<style>
body { 
    font-family: Arial, sans-serif;
    background-color: #131313;
    width: 100vw;
    margin: 5px;
}

* { 
    color: white;
    box-sizing: border-box;
}

img { 
    height: 35%;
    width: 100%;
}

.news-container { 
    display: flex;
    flex-wrap: wrap; 
    gap: 30px;  
    justify-content: center;  
}

.news { 
    background-color: #151515;
    width: 30%;  
    height: auto;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
    margin-bottom: 25px;
}

.news p { 
    line-height: 1.1;
    padding: 5px;
}

.news:hover {
    transform: translateY(-5px);
}

a {
    text-decoration: none;
}

.btn-view { 
    background-color: #002aff;
    border-radius: 8px;
    border: none;
    padding: 10px;
    margin-left: 35%;
}

.btn-view:hover {
    background-color: #0022cf;
    cursor: pointer;
}

.load {
    position: absolute;
	display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
	width: 100px;
	height: 100px;
	border: 3px solid rgba(24, 119, 242, 0.3);
	border-radius: 50%;
	border-top-color: #1877f2;
	animation: spin 1s ease-in-out infinite;
}

@media screen and (max-width: 768px) { 
    .news {
        width: 90%;  
    }
}

.load {
    position: absolute;
	display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
	width: 100px;
	height: 100px;
	border: 3px solid rgba(24, 119, 242, 0.3);
	border-radius: 50%;
	border-top-color: #1877f2;
	animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    from { 
        transform: rotate(0deg); 
    }
    to { 
        transform: rotate(360deg); 
    }
}

</style>

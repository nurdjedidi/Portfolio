<template>
    <v-app>
        <v-main>
            <div v-if="loading" class="load"></div>
            <v-container v-else>
                <v-row>
                    <v-col cols="12" sm="6" md="4" v-for="(article, index) in news" :key="index">
                        <v-card class="d-flex flex-column rounded-lg ma-2">
                            <v-img :src="article.image" alt="Image de l'article"></v-img>
                            <v-card-subtitle class="pa-2">{{ article.author }}</v-card-subtitle>
                            <v-card-text class="pa-2">{{ article.description }}</v-card-text>
                            <v-btn :href="article.url" target="_blank" rel="noopener" color="primary">Learn more</v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
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

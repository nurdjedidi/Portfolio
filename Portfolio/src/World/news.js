const app = Vue.createApp({
    data() { 
        return { 
            news: [], 
            loading: true
        };
    },

    methods: { 
        async fetchNews() { 
            try { 
                const response = await fetch('/news');
                const data = await response.json();
                console.log(data);
                this.news = data.news;
            } catch (error) {
                console.error("Erreur système:", error);
            } finally {
                this.loading = false; 
            }
        }
    },

    mounted() { 
        this.fetchNews();
    }
});

app.mount('#app');

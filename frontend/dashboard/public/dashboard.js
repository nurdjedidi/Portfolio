document.addEventListener("DOMContentLoaded", () => {
    const app = Vue.createApp({
      data() {
        return {
          allData: null,
          localError: null,
          countryName: '',
          capital: '',
          region: '',
          area: '',
          population: '',
          languages: '',
          currency: {},
          timezones: '',
          loading: true,
          error: null,
          worldPopulation: null,
          births: 0,
          deaths: 0,
          birthsPerSecond: 4.19,
          deathsPerSecond: 1.97, 
          confirmed: null,
          deaths: null,
          recovered: null,
          critical: null,
          date: null,
          covidData: null,
        };
      },
      methods: {
        async fetchCountryInfo() {
          try {
            // Utilisation de l'API ipwhois.app
            const geoResponse = await fetch('https://ipwhois.app/json/');
            const geoData = await geoResponse.json();
        
            console.log("Données de géolocalisation:", geoData);  // Afficher la réponse pour déboguer
        
            const countryCode = geoData.country_code;  // Utiliser country_code au lieu de countryCode
            if (!countryCode) {
              throw new Error('Le code pays est introuvable dans la réponse de l\'API de géolocalisation');
            }
        
            console.log("Code pays récupéré:", countryCode);  // Vérification du code pays
        
            // Si le code pays est valide, récupérez les informations du pays
            const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            const countryData = await countryResponse.json();
            const countryInfo = countryData[0];
        
            // Mise à jour des données
            this.countryName = countryInfo.name.common;
            this.capital = countryInfo.capital ? countryInfo.capital[0] : 'Non disponible';
            this.region = countryInfo.region || 'Non disponible';
            this.area = countryInfo.area ? countryInfo.area.toLocaleString() : 'Non disponible';
            this.population = countryInfo.population ? countryInfo.population.toLocaleString() : 'Non disponible';
            this.languages = countryInfo.languages ? Object.values(countryInfo.languages).join(', ') : 'Non disponible';
            this.currency = {
              name: countryInfo.currencies ? Object.values(countryInfo.currencies)[0].name : 'Non disponible',
              code: countryInfo.currencies ? Object.keys(countryInfo.currencies)[0] : 'Non disponible'
            };
            this.timezones = countryInfo.timezones ? countryInfo.timezones.join(', ') : 'Non disponible';
        
          } catch (error) {
            console.error('Erreur lors de la récupération des données géolocalisées :', error);
            this.error = error.message || 'Une erreur est survenue';
          }
        },                  
        async fetchWorldPopulation() {
          try {
            const response = await axios.get('https://get-population.p.rapidapi.com/population', {
              headers: {
                'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776', 
                'x-rapidapi-host': 'get-population.p.rapidapi.com'
              }
            });
            this.worldPopulation = response.data.readable_format; 
            console.log("Population mondiale :", this.worldPopulation);
          } catch (error) {
            console.error('Erreur lors de la récupération de la population mondiale:', error);
          }
        },
        resetAtMidnight() {
          setInterval(() => {
            const now = new Date();
            const lastReset = localStorage.getItem('lastResetDate');
            const today = now.toISOString().split('T')[0]; 
        
            if (lastReset !== today) {
              this.births = 0;
              this.deaths = 0;
              localStorage.setItem('births', 0);
              localStorage.setItem('deaths', 0);
              localStorage.setItem('lastResetDate', today); 
            }
          }, 1000); 
        },        
          async fetchCovidData() {
            const options = {
              method: 'GET',
              url: 'https://covid-19-data.p.rapidapi.com/totals',
              params: { format: 'json' }, 
              headers: {
                'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776', 
                'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
              },
            };
          
            try {
              const response = await axios.request(options);
              const covidData = response.data[0];  
          
              this.covidData = {
                confirmed: covidData.confirmed,
                deaths: covidData.deaths,
                recovered: covidData.recovered,
                critical: covidData.critical,
                active: covidData.active,  
                totalTests: covidData.totalTests, 
                population: covidData.population,  
                date: covidData.date,  
              };
              this.loadingCovid = false;
            } catch (error) {
              this.errorCovid = 'Erreur lors de la récupération des données COVID-19';
              console.error(error);
            }
          }, 
        formatNumber(value) {
          return value ? value.toLocaleString() : 'Données non disponibles';
       },
      },
  
        async mounted() {
          try {
            const savedBirths = localStorage.getItem('births');
            const savedDeaths = localStorage.getItem('deaths');
            this.births = savedBirths ? parseFloat(savedBirths) : 0;
            this.deaths = savedDeaths ? parseFloat(savedDeaths) : 0;
            const lastUpdateTime = localStorage.getItem('lastUpdateTime');
            const now = Date.now();
        
            if (lastUpdateTime) {
              const elapsedSeconds = Math.floor((now - parseInt(lastUpdateTime)) / 1000);
              this.births = savedBirths ? Math.floor(parseFloat(savedBirths) + elapsedSeconds * this.birthsPerSecond) : 0;
              this.deaths = savedDeaths ? Math.floor(parseFloat(savedDeaths) + elapsedSeconds * this.deathsPerSecond) : 0;
            } else {
              this.births = 0;
              this.deaths = 0;
            }
        
            setInterval(() => {
              this.births += this.birthsPerSecond;
              this.deaths += this.deathsPerSecond;
        
              localStorage.setItem('births', this.births);
              localStorage.setItem('deaths', this.deaths);
              localStorage.setItem('lastUpdateTime', Date.now());
            }, 1000);
        
            this.resetAtMidnight();
         
            await Promise.allSettled([
              this.fetchCountryInfo(),
              this.fetchWorldPopulation(),
              this.fetchCovidData(),
            ]);
        
            this.loading = false;

            setInterval(this.fetchWorldPopulation, 10000); 
            setInterval(this.fetchCovidData, 900000); 
          } catch (error) {
            console.error('Erreur lors du chargement initial :', error);
          }
        }        
    });
  
    app.mount('#app');
  });
  
document.addEventListener('DOMContentLoaded', function () { 

    const app = Vue.createApp({ 
        el: '#app',
        data () { 
            return { 
                sexe: '',
                age: null,
                taille: null,
                poids: null,
                activity: null,
                objectif: null,
                user_id: '',
                calories: null,
                glucides: null, 
                lipides: null,
                proteines: null,
                fibres: null,
                sugar: null,
                sodium: null,
                cholesterol: null,
                exercises: '',
                selectedExercise: null,
                searchQuery: '',  
                loading: true,
                suggestions: [], 
            };
        },
        methods: {

            async fetchExercices () { 
                try { 
                    const response = await fetch('/exercises');
                    const data = await response.json();

                    console.log("response :", response);
                    console.log("données recues", data);

                    
                       this.exercises = data;
                    
                }
                catch (err) { 
                    console.error("erreur lors du rendu des exercices", err.message, data);
                }
            }, 

            async fetchUserData() { 
                try { 
                    const response = await fetch('/user-data');
                    const data = await response.json();

                    console.log("response :", response);
                    console.log("données obtenues", data);

               this.sexe = data.sexe;
               this.taille = data.taille;
               this.age = data.age;
               this.poids = data.poids;
               this.activity = data.activity;
               this.objectif = data.objectif;

               if (this.sexe === 'Homme') {
                let bmr = (this.poids * 10) + (this.taille * 6.25) - (this.age * 5) + 5;
            
                if (this.activity === 'Pas actif') {
                    this.calories = bmr * 1.2;
                } else if (this.activity === 'Peu actif') {
                    this.calories = bmr * 1.375;
                } else if (this.activity === 'Actif') {
                    this.calories = bmr * 1.55;
                } else if (this.activity === 'Très actif') {
                    this.calories = bmr * 1.725;
                }
            } else {
                let bmr = (this.poids * 10) + (this.taille * 6.25) - (this.age * 5) - 161;
            
                if (this.activity === 'Pas actif') {
                    this.calories = bmr * 1.2;
                } else if (this.activity === 'Peu actif') {
                    this.calories = bmr * 1.375;
                } else if (this.activity === 'Actif') {
                    this.calories = bmr * 1.55;
                } else if (this.activity === 'Très actif') {
                    this.calories = bmr * 1.725;
                }
            }  

            if (this.objectif === 0) { 
                this.calories;
            }
            else if (this.objectif === 0.5) { 
                 this.calories + 550;
            } else if (this.objectif === 1) { 
                 this.calories + 1100;
            } else if (this.objectif === 1.5) { 
                this.calories - 550;
            } else if (this.objectif === 2) { 
                this.calories - 1100;
            }

               const calories_needed_value = parseInt(this.calories);
               const glucides = this.glucides = Math.round((calories_needed_value * 0.5) / 4);
               const lipides = this.lipides = Math.round((calories_needed_value * 0.3) / 9);
               const proteines = this.proteines = Math.round((calories_needed_value * 0.2) /4);

            
            this.fibres = (this.calories / 1000) * 10;
            this.sugar = (this.calories * 0.10) / 4; 
            this.sodium = 2000; 
            this.cholesterol = 300;
            
                }
                catch (err) { 
                    console.error(err.message, err.stack);
                }
            }, 

            async onInput() {
                if (this.searchQuery.length > 2) {
                  try {
                    const response = await fetch(`/search?name=${encodeURIComponent(this.searchQuery)}`);
                    const data = await response.json();
                    
                    if (data.hints) {
                      this.suggestions = data.hints.map(hint => ({
                        label: hint.food.label,   
                        nutrients: hint.food.nutrients, 
                        image: hint.food.image, 
                      }));
                      console.log(this.suggestions); 
                    }
                  } catch (error) {
                    console.error("Erreur lors de la recherche", error);
                  }
                } else {
                  this.suggestions = [];
                }
              },              
              selectSuggestion(suggestion) {
                console.log("Suggestion sélectionnée:", suggestion);
                this.searchQuery = suggestion.food.label;  
                this.suggestions = [];  
              },

            async GainOrLoose () { 
                this.perte = "maintenir mon poids actuel";
                this.gain = "maintenir mon poids actuel";
            },

            async updateUserData() {
                try {
                    const userData = {
                        sexe: this.sexe || null,
                        age: this.age || null,
                        taille: this.taille || null,
                        poids: this.poids || null,
                        activity: this.activity || null,
                        objectif: this.objectif || null
                      };
                  
                      const response = await axios.put('/update-user-data', userData);
                } catch (error) {
                  console.error('Erreur lors de la mise à jour de l\'utilisateur', error.response.data);
                }
              },
            
              async changeGoal() { 

                if (this.objectif === 0) { 
                    this.calories;
                }
                else if (this.objectif === 0.5) { 
                    this.calories = this.calories + 550;
                } else if (this.objectif === 1) { 
                    this.calories = this.calories + 1100;
                } else if (this.objectif === 1.5) { 
                    this.calories = this.calories - 550;
                } else if (this.objectif === 2) { 
                    this.calories = this.calories - 1100;
                }
              }, 

              async showExercises(exercise) {
                this.selectedExercise = exercise;
              },

              closeExerciseDetails() {
                this.selectedExercise = null;
              },

              async addToCalories () { 
                const firstSuggestion = this.suggestions[0]; 
                if (firstSuggestion && firstSuggestion.nutrients) {
                  const newCalories = this.calories - firstSuggestion.nutrients.ENERC_KCAL;
                  this.calories = newCalories;
              } 
              }
        },

        async mounted () { 
            try { 
                this.fetchExercices();
                this.fetchUserData();
                this.GainOrLoose();
                this.updateUserData(); 
                this.closeExerciseDetails();
                this.onInput();
                this.addToCalories();
                this.changeGoal();
                }
            catch (err) { 
                console.error(err.message);
            };
        }
    });

    app.mount('#app');
})
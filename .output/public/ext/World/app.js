import express from 'express';

const app = express();

app.get('/news', async (req, res) => {
    try {
      const currentsapi = 'fcmIcQJ4nZ0pcw8KoQEz36Gkr_3YvkFeiyFHNbG_ae5tQsY-';
        const language = req.get('Accept-Language') || 'en';
  
      console.log(language);
  
      const response = await axios.get('https://api.currentsapi.services/v1/search', {
        params: {
          apiKey: currentsapi, 
          language: language.substring(0, 2)
        },
      });
  
      console.log(response);
  
      if (response.data && response.data.news) {
        res.json({ news: response.data.news });  
      } else {
        res.status(404).json({ error: 'Aucune actualité trouvée.' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error.message);
      res.status(500).json({ error: 'Impossible de récupérer les actualités pour le moment.' });
    }
  });
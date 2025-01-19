// server/api/news.js
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const currentsapi = 'fcmIcQJ4nZ0pcw8KoQEz36Gkr_3YvkFeiyFHNbG_ae5tQsY-';
  const language = event.req.headers['accept-language'] || 'en';

  try {
    const response = await axios.get('https://api.currentsapi.services/v1/search', {
      params: {
        apiKey: currentsapi,
        language: language.substring(0, 2),
      },
    });

    if (response.data && response.data.news) {
      return { news: response.data.news };
    } else {
      throw new Error('Aucune actualité trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error.message);
    return { error: 'Impossible de récupérer les actualités.' };
  }
});


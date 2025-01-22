import { c as defineEventHandler } from '../../_/nitro.mjs';
import axios from 'axios';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'ipx';
import 'node:path';

const news = defineEventHandler(async (event) => {
  const currentsapi = "fcmIcQJ4nZ0pcw8KoQEz36Gkr_3YvkFeiyFHNbG_ae5tQsY-";
  const language = event.req.headers["accept-language"] || "en";
  try {
    const response = await axios.get("https://api.currentsapi.services/v1/search", {
      params: {
        apiKey: currentsapi,
        language: language.substring(0, 2)
      }
    });
    if (response.data && response.data.news) {
      return { news: response.data.news };
    } else {
      throw new Error("Aucune actualit\xE9 trouv\xE9e.");
    }
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des actualit\xE9s:", error.message);
    return { error: "Impossible de r\xE9cup\xE9rer les actualit\xE9s." };
  }
});

export { news as default };
//# sourceMappingURL=news.mjs.map

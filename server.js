import express from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import formData from 'form-data';
import { Resend } from 'resend';


const port = process.env.PORT || 5000; 
const app = express();
dotenv.config();

const resend = new Resend("re_McfbyRo5_EGaL6bZHPt8DFA6yzUp54PSx"); 

const options = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mot_de_passe',
  database: process.env.DB_DATABASE || 'clients',
};

const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/ext', express.static(path.join(__dirname, 'ext')));
app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/accueil.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'ext', 'Urbanstyle', 'accueil.html'));
});

app.get('/news.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'ext', 'World', 'news.html'));
});


app.post('/send-mail', async (req, res) => { 
  try { 
    const {name, lastName, email, message} = req.body;

    const response = await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: email,
      subject: '[portfolionurdjedd.com]: your email has been successfully sent',
      text: 'This is an automated message, please do not reply. ',
    });

    const question = await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: 'djedidinur@gmail.com',
      subject: '[portfolionurdjedd.com]: New Message from Portfolio',
      text: `${name} ${lastName}  ${email} wrote:\n\n${message}`,    
    });

    res.redirect('/');
  } 
  catch (err) { 
    console.log("Erreur lors de l'envoie du mail");
    console.log(err.message, err.stack);
  }
})

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

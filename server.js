
import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import http from 'http';
import fs from 'fs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectionPool } from './db.js'; 
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';
import MySQLStoreFactory from 'express-mysql-session';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import useragent from 'useragent';
import dayjs from 'dayjs';


const port = process.env.PORT || 5000; 
const app = express();

const options = {
  host: 'localhost',
  user: 'root',
  password: '17/Juin/2006',
  database: 'health_db',
};

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore(options);

const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'frontend'))); 
app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ 
    secret: 'abc',  
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {maxAge: 86400000, secure: false, httpOnly: true}, 
}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
  const userAgentString = req.headers['user-agent'];
  const agent = useragent.parse(req.headers['user-agent']);

  console.log('Parsed Agent:', agent);
  const deviceType = userAgentString.toLowerCase().includes('mobile') ||
                     agent.family.toLowerCase().includes('mobile')
      ? 'phone'
      : userAgentString.toLowerCase().includes('tablet') ||
        agent.family.toLowerCase().includes('tablet')
      ? 'tablet'
      : 'desktop'; 

      console.log('Device Type:', deviceType); 


  if (deviceType === 'desktop') {
    res.redirect('/desktop-home');
  } else if (deviceType === 'phone') {
    res.redirect('/mobile-home');
  } else if (deviceType === 'tablet') {
    res.redirect('/tablet-home');
  } else {
    res.status(400).send('Unknown device type');
  }
});

app.get('/desktop-home', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'portfolio.html'));
});

app.get('/mobile-home', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'présentation.html'));
});

app.get('/tablet-home', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'tablet.html'));
});

passport.use(new LocalStrategy(async (username, password, done) => {
  console.log("Tentative de connexion avec username:", username);
  try {
      const connection = await connectionPool.getConnection();

      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

      if (rows.length === 0) {
          console.log("Utilisateur non trouvé :", username);
          return done(null, false, { message: 'Utilisateur non trouvé' });
      };

      const users = rows[0];

      const isMatch = await bcrypt.compare(password, users.password);
      if (!isMatch) {
          console.log("Mot de passe incorrect pour :", username);
          return done(null, false, { message: 'Mot de passe incorrect' });
      };

      console.log("Connexion réussie pour :", username);
      connection.release();
      return done(null, users); 

  } catch (err) {
      console.error("Erreur dans LocalStrategy :", err.message);
      return done(err);
  };
}));

passport.serializeUser( async (user, done) => { 
  console.log("Sérialisation de l'utilisateur", user);
  try { 
      done(null, user.id);
      console.log("serialisation avec l'id :", user.id);
  } 
  catch (err) { 
      console.error(err.message);
      done(err); 
  };
});

passport.deserializeUser(async (id, done) => {
  console.log("Désérialisation de l'utilisateur avec l'ID", id);
  const connection = await connectionPool.getConnection();
  try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);

      if (rows.length === 0) {
          return done(new Error('Utilisateur non trouvé'), null);
      }

      const dbUser = rows[0];

      console.log("Utilisateur désérialisé:", dbUser);
      done(null, dbUser); 
  } catch (err) {
      console.error('Erreur lors de la désérialisation de l\'utilisateur:', err.message);
      done(err);
  }
  finally { 
      connection.release();
  };
});

function ensureAuthenticated(req, res, next) {
  console.log("Middleware vérification de l'authentification");
  console.log("req.isAuthenticated():", req.isAuthenticated());
  console.log("req.user:", req.user);
  console.log("Session:", req.session);

  if (req.isAuthenticated() && req.user) {
      return next();
  };
  console.error("Échec de l'authentification : utilisateur non authentifié");
  res.status(401).json({ error: 'Utilisateur non authentifié' });
};

app.get('/health.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'health', 'health.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'health', 'login.html')); 
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'health', 'dashboard.html')); 
});


app.post('/signup', async (req, res) => { 
  const { username, password, email } = req.body;
  try { 
      const connection = await connectionPool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);  

      await connection.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);

      connection.release(); 
      res.redirect('/login.html');
  }
  catch (err) { 
      console.error(err.message, err.stack);
  };
}); 

app.get('/login', async (req, res) => { 
  try { 
      res.redirect('/login.html')
  }
  catch (err) { 
      console.log(err.message);
  };
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("Session après la sérialisation :", req.session);
  res.redirect('/dashboard.html');
});


app.post('/dashboard',  async (req, res) => { 
  const connection = await connectionPool.getConnection();
  const { sexe, taille, age, poids, activity, objectif } = req.body;
  console.log({ sexe, taille, age, poids, activity, objectif });

  try { 
      const userId = req.user.id;
      const [rows] = await connection.execute('INSERT INTO nutrition (sexe, taille, age, poids, activity, objectif, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [sexe, taille, age, poids, activity, objectif, userId]);
      if (!req.session.firstVisitHealth) {
        req.session.firstVisitHealth = true;
        res.redirect('/health.html'); 
      } else {
        res.sendFile(path.join(__dirname, 'frontend', 'health', 'dashboard.html'));
      }
  }
  catch (err) { 
      console.error(err.message, err.stack);
      res.status(500).send("erreur authentification")
  }  
  finally { 
      connection.release(); 
  };
});


app.get('/user-data', ensureAuthenticated,  async (req, res) => { 
  const connection = await connectionPool.getConnection();
  try { 
      const userId = req.user.id;
      const [rows] = await connection.execute('SELECT * FROM nutrition WHERE user_id = ?', [userId]);
      res.json(rows[0]);
     }
  catch (err) { 
      console.error(err.stack);
  }   
  finally { 
      connection.release(); 
  };
}); 

app.get('/exercises', async (req, res) => { 
  try {     
      const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises',  
          params: {
           limit: 500,
          offset: 0
        },
          headers: {
              'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776',
              'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
      };
      
      try {
          const apiResponse = await axios(options);
          res.json(apiResponse.data);  
      } catch (err) {
          console.error('Erreur:', err.response ? err.response.data : err.message);
          res.status(500).send('Erreur interne du serveur'); 
      }
  }
  catch (err) { 
      console.error(err.message, err.stack);
  }
});


app.get('/search', async (req, res) => {
  const searchQuery = req.query.name;
  try {
      const options = {
          method: 'GET',
          url: 'https://api.edamam.com/api/food-database/v2/parser',
          params: {
              app_id: '3ae0b4bf', 
              app_key:'3d500bf4ecc67e8d1d79c42348a13432', 
              ingr: searchQuery,  
          },
      };

      const apiResponse = await axios(options);
      console.log("Données brutes reçues de l'API :", apiResponse.data);
     if (apiResponse.headers['content-type'].includes('application/json')) {
      res.json(apiResponse.data); 
  } else {
      throw new Error('Réponse de l\'API pas au format JSON');
  }

  } catch (err) {
      console.error("Erreur lors de la transmission des données :", err.response ? err.response.data : err.message);
      res.status(500).send("Internal server error");
  }
});

app.put('/update-user-data', ensureAuthenticated, async (req, res) => { 
  const connection = await connectionPool.getConnection();
  const { sexe, age, taille, poids, activity, objectif } = req.body;
  const userId = req.user.id;
  console.log("id:", userId, sexe, taille, age, poids, activity, objectif);
  try { 
  const updateFields = {}; 
if (sexe !== undefined && sexe !== null) updateFields.sexe = sexe;
if (taille !== undefined && taille !== null) updateFields.taille = taille;
if (age !== undefined && age !== null) updateFields.age = age;
if (poids !== undefined && poids !== null) updateFields.poids = poids;
if (activity !== undefined && activity !== null) updateFields.activity = activity;
if (objectif !== undefined && objectif !== null) updateFields.objectif = objectif;

const setClause = Object.keys(updateFields)
  .map(key => `${key} = ?`)
  .join(', ');

const values = [...Object.values(updateFields), userId]; 

const query = `UPDATE nutrition SET ${setClause} WHERE user_id = ?`;

  }
  catch (err) { 
      console.error("erreur lors de la mise a jour de l'utilisateur", err.message, err.stack);
      res.status(500).send("Internal server error");
  }
  finally { 
      connection.release();
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});


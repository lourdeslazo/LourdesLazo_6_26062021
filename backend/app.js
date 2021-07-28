// Modules requis
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//Mise en place de la sécurité
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const rateLimit = require('./middleware/ratelimit');
const nocache = require("nocache");

require('dotenv').config();
const mongoUri = process.env.MONGO_URI;

//Routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();
app.use(nocache());

app.use(rateLimit); //Limite de requêtes
app.use(helmet()); //Protection des entêtes Http

//Conexion à Mongoose
mongoose.connect(mongoUri,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Accès à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Cookies en Http
app.use(cookieSession({
  secret: 'sessionS3cur3',
  cookie : {
    secure : true,
    httpOnly : true,
    domain : 'http://localhost:3000'
  }
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

//Enregistre les routes dans l'app
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
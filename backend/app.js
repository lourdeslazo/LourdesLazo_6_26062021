const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Sauce = require('./models/sauces');

const userRoutes = require('./routes/user');

//conexion a mongoose
mongoose.connect('mongodb+srv://lourdes:iannickloic@cluster0.nc7zk.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Acces a lapi depuis nimporte quelle origine
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use(express.urlencoded());

//infos requis du corps de la requete
app.post('/api/sauces', (_req, res, _next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body
  });
  sauce.save() //enregistre dans la base de donnees
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

//recupere produits
app.use('/api/sauces', (_req, res, _next) => { //url demande par le frontend
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
});

app.use('/api/auth', userRoutes); //enregistre la route dans lapp
module.exports = app;
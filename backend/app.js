const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Object = require('./models/Object');

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
  const object = new Object({
    ...req.body
  });
  object.save() //enregistre dans la base de donnees
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

//modifie un objet
app.put('/api/stuff/:id', (req, res, next) => {
  Object.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'objet modifie'}))
  .catch(error => res.status(400).json({ error }));
});

//supprime un objet
app.delete('/api/sauces/:id', (req, res, next) => {
  Object.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'objet supprime'}))
  .catch(error => res.status(400).json({ error }));
});

// recuperation dun seul objet
app.get('/api/sauces/:id', (req, res, next) => {
  Object.findOne({ _id: req.params.id})
  .then(object => res.status(200).json(object))
  .catch(error => res.status(404).json({ error }));
});

//recuperation des objets
app.get('/api/sauces', (_req, res, _next) => { //url demande par le frontend
  Object.find()
  .then(objects => res.status(200).json(objects))
  .catch(error => res.status(400).json({ error }));
});

app.use('/api/auth', userRoutes); //enregistre la route dans lapp
module.exports = app;
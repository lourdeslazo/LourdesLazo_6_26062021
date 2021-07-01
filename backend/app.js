const express = require('express');

const app = express();

const mongoose = require('mongoose');

//conexion a mongoose
mongoose.connect('mongodb+srv://lourdes:iannickloic@cluster0.nc7zk.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  // Acces a lapi depuis nimporte quelle origine
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




//test produits
app.use('/api/sauces', (_req, res, _next) => {
    const sauces = [
        {
            _id: '',
            userId: '',
            name: '',
            manufacturer: '',
            description: '',
            mainPepper: '',
            imageUrl: '',
            heat: '',
            likes: '',
            dislikes: '',
        },
    ];
    res.status(200).json(sauces);
});

module.exports = app;
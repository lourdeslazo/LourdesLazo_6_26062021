const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//conexion a mongoose
mongoose.connect('mongodb+srv://newUser:kgnUbFhx0qTXqJ1v@cluster0.0fosz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// Acces a lapi depuis nimporte quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes); //enregistre la route dans lapp

module.exports = app;
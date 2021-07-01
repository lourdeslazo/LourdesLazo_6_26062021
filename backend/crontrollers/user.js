const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.signup = (req, res, next) => { //cripte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({ //cree le nouveau utilisateur
            email: req.body.email,
            password: hash
        });
        user.save() //enregistre dans la base de donnees
        .then(() => res.status(201).json({ message: 'Utilisateur cree!'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => {

};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => { //cripte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({ //cree le nouveau utilisateur
            email: req.body.email,
            password: hash
        });
        user.save() //enregistre dans la base de donnees
        .then(() => res.status(201).json({ message: 'Utilisateur cree'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => { //on recupere lutilisateur de la base de donne 
    User.findOne({ email: req.body.email }) 
      .then(user => {
        if (!user) { //si on n-a pas trouve lutilisateur
          return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        bcrypt.compare(req.body.password, user.password) //on compare le mot de passe avec le hash
          .then(valid => {
            if (!valid) { //si le mot de passe nest pas le meme on renvoie une erreur
              return res.status(401).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({ //identifiants valables, on renvoie le token a lutilisateur
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RAMDOM_TOKEN_SECRET', //on encode le user
                { expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
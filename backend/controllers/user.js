//Cryptage de données
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

const MaskData = require("maskdata");

exports.signup = (req, res, next) => { 
    //Cripte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({ //Crée le nouveau utilisateur
            email: MaskData.maskEmail2(req.body.email), //Masquage de données
            password: hash
        });
        user.save() //Enregistre l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 

exports.login = (req, res, next) => {  //On récupère l'utilisateur de la base de données
  User.findOne({ email: MaskData.maskEmail2(req.body.email)}) //Masquage de données 
      .then(user => {
        if (!user) { //Si l'utilisateur est incorrect
          return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        bcrypt.compare(req.body.password, user.password) //On compare le mot de passe avec le hash
          .then(valid => {
            if(!valid) { //Si le mot de passe n'est pas le même on renvoie une erreur
              return res.status(401).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({ //Identifiants valables, on renvoie le token à l'utilisateur
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET', //On encode le user
                { expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
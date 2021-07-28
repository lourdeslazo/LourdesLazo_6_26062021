const Sauce = require('../models/Sauces');
const fs = require('fs');

const xss = require('xss')

//Infos requis du corps de la requête
exports.createSauce = (req, res, next) => { //Création d'une sauce
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ //Sécurité contre les XSS attaques
      userId :  xss(sauceObject.userId), 
      name : xss(sauceObject.name),
      manufacturer : xss(sauceObject.manufacturer),
      description :  xss(sauceObject.description),
      mainPepper :  xss(sauceObject.mainPepper),
      heat : sauceObject.heat,
      likes : '0',
      dislikes : '0',
      usersLiked : [],
      usersDisliked : [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //Enregistre les informations dans la base de données
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

//Modifie un objet
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

//Implementation de Like et dislike
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const indexLike = sauce.usersLiked.findIndex(
        (e) => e === req.body.userId
      );
      const indexDislike = sauce.usersDisliked.findIndex(
        (e) => e === req.body.userId
      );

      switch (req.body.like) {
        case 1: //Si l'utilisateur aime la sauce
          if (indexLike <= -1) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += 1;
          }
          if (indexDislike > -1) { 
            sauce.usersDisliked.splice(indexDislike, 1);
            sauce.dislikes -= 1;
          }
          break;
        case 0: 
          if (indexLike > -1) {
            sauce.usersLiked.splice(indexLike, 1);
            sauce.likes -= 1;
          }

          if (indexDislike > -1) {
            sauce.usersDisliked.splice(indexDislike, 1);
            sauce.dislikes -= 1;
          }
          break;
        case -1: //Si l'utilisateur n'aime pas la sauce
          if (indexLike > -1) {
            sauce.usersLiked.splice(indexLike, 1);
            sauce.likes -= 1;
          }
          if (indexDislike <= -1) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
          }

          break;
      }

      Sauce.updateOne({ _id: req.params.id },
          {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
          }
        )
        .then((result) => {
          result ? res.status(200).json(result) : res.status(401).json(null);
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

//Supprime un objet
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//Recuperation d'un seul objet
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};

//Recuperation de tous les objets
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};
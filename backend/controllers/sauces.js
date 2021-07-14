const Sauce = require('../models/Sauces');
const fs = require('fs');

//Infos requis du corps de la requète
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //Enregistre dans la base de données
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

//Like et dislike
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
        case 1: //si lutilisateur aime la sauce
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
        case -1: // si lutilisateur naime pas la sauce
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
exports.getAllSauces = (req, res, next) => { //Url demandé par le frontend
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};
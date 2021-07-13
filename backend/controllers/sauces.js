const Object = require('../models/Object');
const fs = require('fs');

//Infos requis du corps de la requète
exports.createObject = (req, res, next) => {
  const objectProduct = JSON.parse(req.body.object);
    delete objectProduct._id;
    const object = new Object({
      ...objectProduct,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    object.save() //Enregistre dans la base de données
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

//Modifie un objet
exports.modifyObject = (req, res, next) => {
  const objectProduct = req.file ?
  {
    ...JSON.parse(req.body.object),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Object.updateOne({ _id: req.params.id }, { ...objectProduct, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

//Like et dislike
exports.stateObject = (req, res, next) => {
  Object.findOne({ _id: req.params.id })
    .then((object) => {
      const indexLike = object.usersLiked.findIndex(
        (e) => e === req.body.userId
      );
      const indexDislike = object.usersDisliked.findIndex(
        (e) => e === req.body.userId
      );

      switch (req.body.like) {
        case 1: //si lutilisateur aime la sauce
          if (indexLike <= -1) {
            object.usersLiked.push(req.body.userId);
            object.likes += 1;
          }
          if (indexDislike > -1) { 
            object.usersDisliked.splice(indexDislike, 1);
            object.dislikes -= 1;
          }
          break;
        case 0: 
          if (indexLike > -1) {
            object.usersLiked.splice(indexLike, 1);
            object.likes -= 1;
          }

          if (indexDislike > -1) {
            object.usersDisliked.splice(indexDislike, 1);
            object.dislikes -= 1;
          }
          break;
        case -1: // si lutilisateur naime pas la sauce
          if (indexLike > -1) {
            object.usersLiked.splice(indexLike, 1);
            object.likes -= 1;
          }
          if (indexDislike <= -1) {
            object.usersDisliked.push(req.body.userId);
            object.dislikes += 1;
          }

          break;
      }

      Object.updateOne({ _id: req.params.id },
          {
            likes: object.likes,
            dislikes: object.dislikes,
            usersLiked: object.usersLiked,
            usersDisliked: object.usersDisliked,
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
exports.deleteObject = (req, res, next) => {
  Object.findOne({ _id: req.params.id })
  .then(object => {
    const filename = object.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Object.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//Recuperation d'un seul objet
exports.getOneObject = (req, res, next) => {
  Object.findOne({ _id: req.params.id })
  .then(object => res.status(200).json(object))
  .catch(error => res.status(404).json({ error }));
};

//Recuperation de tous les objets
exports.getAllObjects = (req, res, next) => { //Url demandé par le frontend
  Object.find()
  .then(objects => res.status(200).json(objects))
  .catch(error => res.status(400).json({ error }));
};
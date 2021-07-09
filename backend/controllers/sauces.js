const Object = require('../models/Object');

//Infos requis du corps de la requète
exports.createObject = (req, res, next) => {
  const objectProduct = JSON.parse(req.body.object;
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
  Object.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

//Supprime un objet
exports.deleteObject =  (req, res, next) => {
  Object.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
  .catch(error => res.status(400).json({ error }));
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
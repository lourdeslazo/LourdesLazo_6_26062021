const express = require('express');
const router = express.Router();

const Object = require('../models/Object');

//infos requis du corps de la requete
router.post('/', (_req, res, _next) => {
    delete req.body._id;
    const object = new Object({
      ...req.body
    });
    object.save() //enregistre dans la base de donnees
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });
  
  //modifie un objet
  router.put('/:id', (req, res, next) => {
    Object.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'objet modifie'}))
    .catch(error => res.status(400).json({ error }));
  });
  
  //supprime un objet
  router.delete('/:id', (req, res, next) => {
    Object.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'objet supprime'}))
    .catch(error => res.status(400).json({ error }));
  });
  
  // recuperation dun seul objet
  router.get('/:id', (req, res, next) => {
    Object.findOne({ _id: req.params.id})
    .then(object => res.status(200).json(object))
    .catch(error => res.status(404).json({ error }));
  });
  
  //recuperation des objets
  router.get('/', (_req, res, _next) => { //url demande par le frontend
    Object.find()
    .then(objects => res.status(200).json(objects))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = router;